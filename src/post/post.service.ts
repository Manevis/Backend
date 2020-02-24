import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './post.entity';
import { UsersService } from '../users/users.service';
import { GetPostsDto } from './dto/get-posts.dto';
import { SubjectService } from '../subject/subject.service';
import { PostStatusEnum } from './enums/post-status.enum';
import { LabelService } from '../label/label.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly usersService: UsersService,
    private readonly subjectService: SubjectService,
    private readonly labelService: LabelService,
  ) {}

  async findAll(getPostsDto: GetPostsDto) {
    const take = Number(getPostsDto.limit) || 10;
    const skip = Number(getPostsDto.page) * Number(take) || 0;
    const subject = getPostsDto.subject;
    const label = getPostsDto.label;
    const username = getPostsDto.user;

    const query = this.postRepository.createQueryBuilder('post');

    if (username) {
      const u = await this.usersService.findOneByUsername(username);
      query.innerJoinAndSelect('post.user', 'user', 'user.id = :id', {
        id: u.id,
      });
    } else {
      query.leftJoinAndSelect('post.user', 'user');
    }

    if (subject) {
      query.innerJoinAndSelect('post.subject', 'subject', 'subject.id = :id', {
        id: subject,
      });
    } else {
      query.leftJoinAndSelect('post.subject', 'subject');
    }

    if (label) {
      query.innerJoinAndSelect('post.labels', 'label', 'label.id = :id', {
        id: label,
      });
    } else {
      query.leftJoinAndSelect('post.labels', 'label');
    }
    query.take(take);
    query.skip(skip);
    query.where('post.status = :status', { status: PostStatusEnum.PUBLISHED });
    query.orderBy('post.id', 'DESC');
    const [posts, totalCount] = await query.getManyAndCount();

    const result = {
      posts,
      user: null,
      subject: null,
      label: null,
      pagination: {
        totalCount,
        size: take,
        page: Number(getPostsDto.page) || 0,
        totalPage: Math.ceil(totalCount / take),
      },
    };

    if (username) {
      result.user = await this.usersService.findOneByUsername(username);
    }
    if (subject) {
      result.subject = await this.subjectService.findOne(subject);
    }
    if (label) {
      result.label = await this.labelService.findOne(label);
    }

    return result;
  }

  async findOne(id: number) {
    try {
      return await this.postRepository.findOneOrFail(id, {
        relations: ['user'],
      });
    } catch {
      throw new HttpException('مقاله مورد نظر یافت نشد', HttpStatus.NOT_FOUND);
    }
  }

  async create(user, createPostDto: CreatePostDto) {
    const u = await this.usersService.findOne(user.id);
    const subject = await this.subjectService.findOne(createPostDto.subjectId);
    const NewPost = new Post();
    NewPost.title = createPostDto.title;
    NewPost.content = createPostDto.content;
    NewPost.cover = createPostDto.cover;
    NewPost.user = u;
    NewPost.subject = subject;
    NewPost.status = PostStatusEnum.PUBLISHED;
    try {
      return await NewPost.save();
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}

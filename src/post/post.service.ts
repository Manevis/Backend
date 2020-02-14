import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './post.entity';
import { UsersService } from '../users/users.service';
import { HashID } from '../Providers/HashID/HashID';
import { GetPostsDto } from './dto/get-posts.dto';
import { SubjectService } from '../subject/subject.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly usersService: UsersService,
    private readonly subjectService: SubjectService,
    private readonly hashID: HashID,
  ) {}

  async findAll(getPostsDto: GetPostsDto) {
    const where: { subject?: number; labels?: number } = {};
    if (getPostsDto.subject) {
      where.subject = getPostsDto.subject;
    }
    if (getPostsDto.label) {
      where['post.labels'] = getPostsDto.label;
    }

    const [posts, totalCount] = await this.postRepository.findAndCount({
      relations: ['subject', 'labels'],
      take: getPostsDto.limit || 10,
      skip: getPostsDto.page * (getPostsDto.limit || 10),
      where,
    });

    return {
      posts,
      pagination: {
        totalCount,
        size: Number(getPostsDto.limit) || 10,
        page: Number(getPostsDto.page) || 0,
        totalPage: Math.ceil(totalCount / (Number(getPostsDto.limit) || 10)),
      },
    };
  }

  async findOne(url: string) {
    let id = url;
    if (url.includes('-')) {
      id = url.split('-').reverse()[0];
    }
    try {
      const post = await this.postRepository.findOne(
        Number(this.hashID.decode(id)),
      );

      if (post) {
        const slugArr = post.title.split(' ');
        slugArr.push(this.hashID.encode(String(post.id)));
        return {
          ...post,
          slug: slugArr.join('-'),
        };
      } else {
        throw new HttpException(
          'مقاله مورد نظر یافت نشد',
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async create(user, createPostDto: CreatePostDto) {
    const u = await this.usersService.findOne(user.id);
    const subject = await this.subjectService.findOne(createPostDto.subjectId);
    const NewPost = new Post();
    NewPost.title = createPostDto.title;
    NewPost.content = createPostDto.content;
    NewPost.user = u;
    NewPost.subject = subject;
    try {
      return await this.postRepository.save(NewPost);
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}

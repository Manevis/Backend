import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './post.entity';
import { UsersService } from '../users/users.service';
import { HashID } from '../Providers/HashID/HashID';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly usersService: UsersService,
    private readonly hashID: HashID,
  ) {}

  async findAll() {
    return await this.postRepository.find({
      relations: ['subject', 'labels'],
    });
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
    const NewPost = new Post();
    NewPost.title = createPostDto.title;
    NewPost.content = createPostDto.content;
    NewPost.user = u;
    try {
      return await this.postRepository.save(NewPost);
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}

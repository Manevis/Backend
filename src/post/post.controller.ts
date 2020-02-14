import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';
import { GetPostsDto } from './dto/get-posts.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  findAll(@Query() getPostsDto: GetPostsDto) {
    return this.postService.findAll(getPostsDto);
  }

  @Get(':url')
  findOne(@Param('url') url) {
    return this.postService.findOne(url);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createPostDto: CreatePostDto, @Req() req) {
    return this.postService.create(req.user, createPostDto);
  }
}

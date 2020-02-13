import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  findAll() {
    return this.postService.findAll();
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

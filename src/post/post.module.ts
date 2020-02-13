import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { UsersModule } from '../users/users.module';
import { HashID } from '../Providers/HashID/HashID';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), UsersModule],
  controllers: [PostController],
  providers: [PostService, HashID],
})
export class PostModule {}

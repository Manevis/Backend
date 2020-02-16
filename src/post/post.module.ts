import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { UsersModule } from '../users/users.module';
import { SubjectModule } from '../subject/subject.module';
import {LabelModule} from "../label/label.module";

@Module({
  imports: [TypeOrmModule.forFeature([Post]), UsersModule, SubjectModule, LabelModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}

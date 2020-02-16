import { Module } from '@nestjs/common';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Photo} from "./photo.entity";
import {UsersModule} from "../users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([Photo]), UsersModule],
  controllers: [PhotoController],
  providers: [PhotoService],
  exports: [PhotoService]
})
export class PhotoModule {}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from './photo.entity';
import { Repository } from 'typeorm';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UsersService } from '../users/users.service';
import { PhotoTypeDto } from './dto/photo-type.dto';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
    private readonly usersService: UsersService,
  ) {}

  async findOne(fileName: string) {
    const photo = await this.photoRepository.findOne({ fileName });
    if (photo) {
      return photo;
    }

    throw new HttpException(
      'تصویر مورد نظر موجود نمی‌باشد. لطفا هفته دیگه سر بزنید!',
      HttpStatus.NOT_FOUND,
    );
  }

  async create(u, createPhotoDto: CreatePhotoDto, p, photoTypeDto: PhotoTypeDto) {
    const user = await this.usersService.findOne(u.id);
    const photo = new Photo();
    photo.name = createPhotoDto.name;
    photo.fileName = p.filename;
    photo.description = createPhotoDto.description;
    photo.type = photoTypeDto.type;
    photo.user = user;
    return await photo.save();
  }
}

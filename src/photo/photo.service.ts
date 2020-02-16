import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from './photo.entity';
import { Repository } from 'typeorm';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UsersService } from '../users/users.service';

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

  async create(u, createPhotoDto: CreatePhotoDto, p) {
    const user = await this.usersService.findOne(u.id);
    const photo = new Photo();
    photo.description = createPhotoDto.description;
    photo.name = createPhotoDto.name;
    photo.name = createPhotoDto.name;
    photo.type = createPhotoDto.type;
    photo.fileName = p.filename;
    photo.user = user;
    return await photo.save();
  }
}

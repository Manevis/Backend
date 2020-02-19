import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Label } from './label.entity';
import { Repository } from 'typeorm';
import { CreateLabelDto } from './dto/create-label.dto';

@Injectable()
export class LabelService {
  constructor(
    @InjectRepository(Label)
    private readonly labelRepository: Repository<Label>,
  ) {}

  async findAll() {
    const [labels, totalCount] = await this.labelRepository.findAndCount({
      select: ['id', 'name'],
    });

    return {
      labels,
      totalCount,
    };
  }

  async findOne(id: number) {
    return await this.labelRepository.findOne(id);
  }

  async findPosts(id: number) {
    return await this.labelRepository.findOne(id, {
      relations: ['posts'],
    });
  }

  async create(createLabelDto: CreateLabelDto) {
    const label: Label = new Label();
    label.name = createLabelDto.name;

    try {
      return await this.labelRepository.save(label);
    } catch (e) {
      throw new HttpException('لیبل تکراری است!', HttpStatus.CONFLICT);
    }
  }
}

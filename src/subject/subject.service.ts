import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from './subject.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SubjectService {
  constructor(@InjectRepository(Subject) private readonly subjectRepository: Repository<Subject>) {
  }

  async findAll() {
    return await this.subjectRepository.find();
  }
}

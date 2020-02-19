import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from './subject.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async findAll() {
    const [subjects, totalCount] = await this.subjectRepository.findAndCount({
      select: ['id', 'name'],
    });

    return {
      subjects,
      totalCount,
    };
  }

  async findOne(id: number) {
    const subject = await this.subjectRepository.findOne(id);

    if (subject) {
      return subject;
    } else {
      throw new HttpException(
        `موضوعی با شماره ${id} یافت نشد!`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findPosts(id: number) {
    return await this.subjectRepository
      .createQueryBuilder('s')
      .where('s.id = :id', { id })
      .leftJoinAndSelect('s.posts', 'subject')
      .getOne();
  }
}

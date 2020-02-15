import {Controller, Get, Param} from '@nestjs/common';
import { SubjectService } from './subject.service';

@Controller('subjects')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Get()
  findAll() {
    return this.subjectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.subjectService.findOne(id);
  }

  @Get(':id/posts')
  findPosts(@Param('id') id: number) {
    return this.subjectService.findPosts(id);
  }
}

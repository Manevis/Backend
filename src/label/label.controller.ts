import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import { LabelService } from './label.service';
import { CreateLabelDto } from './dto/create-label.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('labels')
export class LabelController {
  constructor(private readonly labelService: LabelService) {}

  @Get()
  findAll() {
    return this.labelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.labelService.findOne(id);
  }

  @Get(':id/posts')
  findPosts(@Param('id') id: number) {
    return this.labelService.findPosts(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createLabelDto: CreateLabelDto) {
    return this.labelService.create(createLabelDto);
  }
}

import {IsArray, IsNumberString, IsOptional, IsString} from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  cover: string;

  @IsNumberString()
  @IsOptional()
  subjectId: number;

  @IsArray()
  @IsOptional()
  labels: number[];
}

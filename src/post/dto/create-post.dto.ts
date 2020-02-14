import { IsNumberString, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsNumberString()
  subjectId: number;
}

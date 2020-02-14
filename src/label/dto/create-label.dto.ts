import { IsString, MinLength } from 'class-validator';

export class CreateLabelDto {
  @IsString()
  @MinLength(3, {message: 'حداقل ۳ کاراکتر برای نام لیبل وارد نمایید'})
  name: string;
}

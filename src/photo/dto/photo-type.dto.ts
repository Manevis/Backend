import { IsEnum } from 'class-validator';
import { PhotoTypeEnum } from '../enum/PhotoType.enum';

export class PhotoTypeDto {
  @IsEnum(PhotoTypeEnum)
  type: string;
}

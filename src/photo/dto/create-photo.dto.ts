import {IsEnum, IsOptional, IsString} from "class-validator";
import {PhotoTypeEnum} from "../enum/PhotoType.enum";

export class CreatePhotoDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsEnum(PhotoTypeEnum)
    type: PhotoTypeEnum;
}

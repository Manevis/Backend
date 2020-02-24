import {IsOptional, IsString} from "class-validator";

export class CreatePhotoDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description: string;
}

import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  links: string;

  @IsString()
  @IsOptional()
  biography: string;

  @IsString()
  @IsOptional()
  avatar: string;
}

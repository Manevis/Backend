import { IsString } from 'class-validator';

export class EmailValidationDto {

  @IsString()
  emailValidationToken: string;
}

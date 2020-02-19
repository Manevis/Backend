import { IsEmail } from 'class-validator';

export class ResendActivationEmailDto {
  @IsEmail()
  email: string;
}

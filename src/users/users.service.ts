import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { EmailValidationDto } from './dto/email-validation.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto): CreateUserDto {
    return createUserDto;
  }

  validateEmail(emailValidationDto: EmailValidationDto) {
    return emailValidationDto;
  }

  register(registerUserDto: RegisterUserDto) {
    return registerUserDto;
  }

  update(updateUserDto: UpdateUserDto) {
    return updateUserDto;
  }
}

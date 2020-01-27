import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { EmailValidationDto } from './dto/email-validation.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SendEmail } from '../Providers/Email/SendEmail.provider';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly sendEmail: SendEmail,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.sendEmail.sendVerificationEmail(createUserDto); // send verification email to that user (Email address)
    const user: User = new User();
    user.email = createUserDto.email;

    try {
      await this.userRepository.save(user);
    } catch (e) {
      return e.code;
    }
    return user;
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

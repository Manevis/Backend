import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { EmailValidationDto } from './dto/email-validation.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SendEmail } from '../Providers/Email/SendEmail.provider';
import { User } from './user.entity';
import Cryption from '../Providers/Cryption/Cryption.provider';
import { UserStatusEnum } from './enums/user-status.enum';

@Injectable()
export class UsersService {
  constructor(
    private readonly sendEmail: SendEmail,
    private readonly cryption: Cryption,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user: User = new User();
    user.email = createUserDto.email;

    try {
      await this.userRepository.save(user);
      this.sendEmail.sendVerificationEmail(
        user,
        this.cryption.encrypt(user.uuid),
      );
      return user;
    } catch (e) {
      return e.code;
    }
  }

  async validateEmail(emailValidationDto: EmailValidationDto) {
    const uuid = this.cryption.decrypt(emailValidationDto.emailValidationToken);
    const user = await this.userRepository.findOne({ uuid });

    if (user) {
      if (user.status === UserStatusEnum.RECEIVED_ACTIVATION_EMAIL) {
        await this.userRepository.update(user, {
          status: UserStatusEnum.CONFIRMED_EMAIL,
        });
      } else {
        throw new HttpException('ایمیل شما پیش از این تایید شده است!', HttpStatus.NOT_ACCEPTABLE);
      }
    } else {
      throw new HttpException('Not Valid', HttpStatus.FORBIDDEN);
    }
  }

  register(registerUserDto: RegisterUserDto) {
    return registerUserDto;
  }

  update(updateUserDto: UpdateUserDto) {
    return updateUserDto;
  }
}

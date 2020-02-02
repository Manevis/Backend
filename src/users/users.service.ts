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

  async findOne(email: string) {
    return await this.userRepository.findOne({ email });
  }

  async create(createUserDto: CreateUserDto) {
    const createdUser: User = await this.userRepository.findOne({
      email: createUserDto.email,
    });

    if (createdUser) {
      switch (createdUser.status) {
        case UserStatusEnum.ACTIVE:
          return {
            ok: true,
            email: createdUser.email,
            userStatus: createdUser.status,
          };
        case UserStatusEnum.CONFIRMED_EMAIL:
          return {
            ok: true,
            userStatus: createdUser.status,
            validationToken: this.cryption.encrypt(createdUser.uuid),
          };
        case UserStatusEnum.BLOCKED:
          return {
            ok: false,
            userStatus: createdUser.status,
          };
        case UserStatusEnum.RECEIVED_ACTIVATION_EMAIL:
          return {
            ok: false,
            userStatus: createdUser.status,
          };
      }
    } else {
      const user: User = new User();
      user.email = createUserDto.email;

      try {
        await this.userRepository.save(user);
        this.sendEmail.sendVerificationEmail(
          user,
          this.cryption.encrypt(user.uuid),
        );
        return {
          ok: true,
          message: `لینک فعال‌سازی به ${user.email} ارسال شد`,
        };
      } catch (e) {
        return e.code;
      }
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
        return {
          ok: true,
          message: `ایمیل ${user.email} با موفقیت تایید گردید.`,
          validationToken: emailValidationDto.emailValidationToken,
        };
      } else {
        throw new HttpException(
          'ایمیل شما پیش از این تایید شده است!',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
    } else {
      throw new HttpException('امکان نداره!', HttpStatus.FORBIDDEN);
    }
  }

  async register(registerUserDto: RegisterUserDto) {
    const {
      firstName,
      lastName,
      username,
      password,
      validationToken,
    } = registerUserDto;
    const uuid = this.cryption.decrypt(validationToken);
    const user: User = await this.userRepository.findOne({ uuid });
    if (user) {
      try {
        if (user.status === UserStatusEnum.CONFIRMED_EMAIL) {
          await this.userRepository.update(user, {
            firstName,
            lastName,
            username,
            password,
            status: UserStatusEnum.ACTIVE,
          });
          return {
            ok: true,
            message: 'ثبت نام شما تکمیل گردید. به Autor.ir خوش آمدید.',
            jwtToken: '293784HJfioudsf897sdfsd;fhsdfh&FD(*S&f2347987',
          };
        }
        throw new HttpException(
          'امکان تکمیل ثبت نام برای شما وجود ندارد. لطفا با پشتیبانی تماس حاصل فرمایید',
          HttpStatus.FORBIDDEN,
        );
      } catch (e) {
        return e;
      }
    } else {
      throw new HttpException(
        'اطلاعت وارد شده صحیح نمی‌باشد!',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  update(user, updateUserDto: UpdateUserDto) {
    return { ...user, ...updateUserDto };
  }
}

import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
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
import { AuthService } from '../auth/auth.service';
import {hash} from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly SALT_ROUND = 10;

  constructor(
    private readonly sendEmail: SendEmail,
    private readonly cryption: Cryption,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({ email });
  }

  async findOne(id: number) {
    return await this.userRepository.findOne(id);
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
          const hashedPassword = await hash(password, this.SALT_ROUND);
          await this.userRepository.update(user, {
            firstName,
            lastName,
            username,
            password: hashedPassword,
            status: UserStatusEnum.ACTIVE,
          });
          const {
            password: pw,
            ...registeredUser
          } = await this.userRepository.findOne({ uuid });
          return this.authService.login({ ...registeredUser });
        }
        throw new HttpException(
          'امکان تکمیل ثبت نام برای شما وجود ندارد. لطفا با پشتیبانی تماس حاصل فرمایید',
          HttpStatus.FORBIDDEN,
        );
      } catch (e) {
        console.log(e);
        return e;
      }
    } else {
      throw new HttpException(
        'اطلاعت وارد شده صحیح نمی‌باشد!',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async update(user, updateUserDto: UpdateUserDto) {
    const u = await this.findOne(user.id);
    await this.userRepository.update(u, {
      ...updateUserDto,
    });

    const updatedUser = await this.findOne(user.id);

    return {
      ok: true,
      message: 'بروزرسانی اطلاعات کاربری شما با موفقیت انجام شد.',
      updatedUser,
    };
  }
}

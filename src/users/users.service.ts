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
import { hash } from 'bcrypt';

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
    return await this.userRepository.findOne(
      { email },
      {
        select: [
          'password',
          'username',
          'firstName',
          'lastName',
          'id',
          'email',
        ],
      },
    );
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne(id);

    if (user) {
      return user;
    }

    throw new HttpException(`کاربری یافت نشد!`, HttpStatus.NOT_FOUND);
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
            ok: true,
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
          userStatus: UserStatusEnum.RECEIVED_ACTIVATION_EMAIL,
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
        user.status = UserStatusEnum.CONFIRMED_EMAIL;
        await user.save();
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
          user.firstName = firstName;
          user.lastName = lastName;
          user.username = username;
          user.password = hashedPassword;
          user.status = UserStatusEnum.ACTIVE;
          await user.save();
          return this.authService.login({ ...user });
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
    const u: User = await this.findOne(user.id);
    u.firstName = updateUserDto.firstName;
    u.lastName = updateUserDto.lastName;
    u.biography = updateUserDto.biography;
    u.phoneNumber = updateUserDto.phoneNumber;
    u.avatar = updateUserDto.avatar;
    u.links = updateUserDto.links;
    await u.save();

    return {
      ok: true,
      message: 'بروزرسانی اطلاعات کاربری شما با موفقیت انجام شد.',
      updatedUser: u,
    };
  }
}

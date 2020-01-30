import {
  IsAlphanumeric,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @MinLength(5, { message: 'برای نام کاربری حداقل 5 کاراکتر نیاز است' })
  @MaxLength(25, { message: 'نام کاربری نمی‌تواند بیشتر از 25 کاراکتر باشد!' })
  @IsAlphanumeric('en-US', {
    message: 'فقط حروف و اعداد (انگلیسی) وارد نمایید!',
  })
  username: string;

  @IsString()
  @MinLength(6, { message: 'رمز عبور باید حداقل شامل 6 کاراکتر باشد.' })
  password: string;

  @IsString()
  validationToken: string;
}

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { EmailValidationDto } from './dto/email-validation.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /*
  * TODO:
  *   1- Insert user in database,
  *   2- Send an email to their email address
  * */
  @Post()
  create(@Body() createUserDto: CreateUserDto): CreateUserDto {
    return this.usersService.create(createUserDto);
  }

  /*
  * TODO:
  *   1- validate user with validation token
  *   2- change their status to registered
  *   3- move to a page to enter first-name, last-name, username
  * */
  @Get('email-validation/:emailValidationToken')
  validateEmail(@Param() emailValidationDto: EmailValidationDto) {
    return this.usersService.validateEmail(emailValidationDto);
  }

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    this.usersService.register(registerUserDto);
  }
}

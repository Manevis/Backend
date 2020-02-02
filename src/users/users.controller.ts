import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { EmailValidationDto } from './dto/email-validation.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  login(@Req() req) {
    return this.authService.login(req.user);
  }

  @Get('email-validation/:emailValidationToken')
  validateEmail(@Param() emailValidationDto: EmailValidationDto) {
    return this.usersService.validateEmail(emailValidationDto);
  }

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.usersService.register(registerUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch()
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user, updateUserDto);
  }
}

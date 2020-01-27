import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../users/dto/create-user.dto';

@Injectable()
export class SendEmail {
  sendVerificationEmail(createUserDto: CreateUserDto) {
    console.log(`We sent an email to ${createUserDto.email} successfully.`);
  }
}

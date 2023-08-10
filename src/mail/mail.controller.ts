import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from 'src/users/users.service';
import { MailService } from './mail.service';

@Controller('')
export class MailController {
  constructor(private users: UsersService, private mailer: MailService) {}

  @Get('/api/email/send')
  async verify(@Query('email') mail: string) {
    await this.mailer.sendVerification(mail);
    return { message: 'ok' };
  }

  @UseGuards(AuthGuard)
  @Get('/api/email/verify')
  async verifyCode(@Query('code') code: string, @Query('email') mail: string) {
    return this.mailer.doVerify(mail, code);
  }
}

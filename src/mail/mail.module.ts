import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { UsersService } from 'src/users/users.service';

@Module({
  providers: [MailService, UsersService],
  controllers: [MailController],
})
export class MailModule {}

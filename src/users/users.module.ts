import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MailService } from 'src/mail/mail.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, MailService],
})
export class UsersModule {}

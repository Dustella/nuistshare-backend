import { Module } from '@nestjs/common';
import { ArchiveModule } from './archives/archives.module';
import { DownloadModule } from './download/download.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ArchiveModule,
    DownloadModule,
    UsersModule,
    AuthModule,
    PrismaModule,
    MailModule,
  ],
  providers: [AuthService, PrismaService],
})
export class AppModule {}

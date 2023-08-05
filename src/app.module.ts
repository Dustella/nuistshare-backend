import { Module } from '@nestjs/common';
import { ArchiveModule } from './archives/archives.module';
import { DownloadModule } from './download/download.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [ArchiveModule, DownloadModule, UsersModule, AuthModule],
  providers: [AuthService],
})
export class AppModule {}

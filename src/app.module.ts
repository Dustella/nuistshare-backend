import { Module } from '@nestjs/common';
import { ArchiveModule } from './archives/archives.module';
import { DownloadModule } from './download/download.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ArchiveModule, DownloadModule, UsersModule],
})
export class AppModule {}

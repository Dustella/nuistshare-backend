import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArchiveModule } from './archives/archives.module';
import { DownloadModule } from './download/download.module';

@Module({
  imports: [ArchiveModule, DownloadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

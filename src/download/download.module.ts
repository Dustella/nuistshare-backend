import { Module } from '@nestjs/common';
import { DownloadController } from './download.controller';
import { DownloadService } from './donwload.service';

@Module({
  imports: [],
  controllers: [DownloadController],
  providers: [DownloadService],
})
export class DownloadModule {
  constructor(private readonly downloader: DownloadService) {}
}

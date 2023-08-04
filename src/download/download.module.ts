import { Module } from '@nestjs/common';
import { DownloadController } from './download.controller';
import { PrismaService } from 'src/prisma.service';
import { DownloadService } from './donwload.service';

@Module({
  imports: [],
  controllers: [DownloadController],
  providers: [PrismaService, DownloadService],
})
export class DownloadModule {
  constructor(
    private prisma: PrismaService,
    private readonly downloader: DownloadService,
  ) {}
}

import { Module } from '@nestjs/common';
import { DownloadController } from './download.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [],
  controllers: [DownloadController],
  providers: [PrismaService],
})
export class DownloadModule {
  constructor(private prisma: PrismaService) {}
}

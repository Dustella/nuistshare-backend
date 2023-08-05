import { Module } from '@nestjs/common';
import { ArchiveController } from './archives.controller';
import { PrismaService } from 'src/prisma.service';
import { ArchivesService } from './archives.service';

@Module({
  imports: [],
  controllers: [ArchiveController],
  providers: [PrismaService, ArchivesService],
})
export class ArchiveModule {
  constructor(private prisma: PrismaService) {}
}

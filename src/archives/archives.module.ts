import { Module } from '@nestjs/common';
import { ArchiveController } from './archives.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [],
  controllers: [ArchiveController],
  providers: [PrismaService],
})
export class ArchiveModule {
  constructor(private prisma: PrismaService) {}
}

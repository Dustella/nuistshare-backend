import { Module } from '@nestjs/common';
import { ArchiveController } from './archives.controller';
import { ArchivesService } from './archives.service';

@Module({
  imports: [],
  controllers: [ArchiveController],
  providers: [ArchivesService],
})
export class ArchiveModule {}

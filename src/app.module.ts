import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArchiveModule } from './archives/archives.module';

@Module({
  imports: [ArchiveModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

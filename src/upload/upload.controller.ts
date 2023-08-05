import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('')
export class UploadController {
  constructor(
    private uploadService: UploadService,
    private prisma: PrismaService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/api/upload/token')
  async getToken(@Req() req) {
    const { sub } = req.user;

    const user = await this.prisma.users.findUnique({
      where: { id: sub },
    });

    if (!user.verified) {
      throw new HttpException('Not Verified', HttpStatus.FORBIDDEN);
    }
    return { uploadToken: this.uploadService.generateToken() };
  }
}

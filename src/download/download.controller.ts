import { Redirect } from '@nestjsplus/redirect';
import { Controller, Get, Query, Res } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { DownloadService } from './donwload.service';

@Controller('/api/download')
export class DownloadController {
  constructor(
    private prisma: PrismaService,
    private downloader: DownloadService,
  ) {}

  @Get()
  @Redirect()
  async getDownload(@Query('metadata_id') id: string, @Res() resp) {
    const item = await this.prisma.metadata.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    // update download count
    await this.prisma.archive.update({
      where: {
        id: item.archiveId,
      },
      data: {
        downloadCount: {
          increment: 1,
        },
      },
    });

    const metadata = item;
    const downloadUrl = await this.downloader.getDriverUrl(metadata);
    resp.status(302).redirect(downloadUrl);
  }
}

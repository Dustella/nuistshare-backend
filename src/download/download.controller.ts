import { Redirect } from '@nestjsplus/redirect';
import { Controller, Get, Param, Res } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Controller('/api/download')
export class DownloadController {
  constructor(private prisma: PrismaService) {}

  @Get('/archive/:id')
  @Redirect()
  async getDownload(
    @Param('metadata_id') id: string,
    @Param('archive_id') item_id: string,
    @Res() resp,
  ) {
    const item = await this.prisma.metadata.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    // update download count
    await this.prisma.archive.update({
      where: {
        id: parseInt(item_id),
      },
      data: {
        downloadCount: {
          increment: 1,
        },
      },
    });

    const metadata = item;
    const { target, driver } = metadata;
    switch (driver) {
      case 'cloudreve': {
        const hostname = new URL(target).hostname;
        const hash = target.split('/').pop();

        const apiUrl = `https://${hostname}/api/v3/share/download/${hash}`;
        console.log(apiUrl);
        const res = await fetch(apiUrl, {
          method: 'PUT',
        });
        const downUrl = (await res.json()).data;

        resp.status(302).redirect(downUrl);
      }
    }
  }
}

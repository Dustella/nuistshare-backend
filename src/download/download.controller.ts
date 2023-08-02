import { Redirect } from '@nestjsplus/redirect';
import { Controller, Get, Param, Res } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Controller('/api/download')
export class DownloadController {
  constructor(private prisma: PrismaService) {}

  @Get('/archive/:id')
  @Redirect()
  async getDownload(@Param('id') id: string, @Res() resp) {
    const item = await this.prisma.archive.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        metadata: true,
      },
    });
    // update download count
    await this.prisma.archive.update({
      where: {
        id: parseInt(id),
      },
      data: {
        downloadCount: {
          increment: 1,
        },
      },
    });

    const { metadata } = item;
    const { href, type } = metadata[0];
    switch (type) {
      case 'cloudreve': {
        const hostname = new URL(href).hostname;
        const hash = href.split('/').pop();

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

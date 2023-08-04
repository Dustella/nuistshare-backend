import { Redirect } from '@nestjsplus/redirect';
import { Controller, Get, Query, Res } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Controller('/api/download')
export class DownloadController {
  constructor(private prisma: PrismaService) {}

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
      case 'alist': {
        const hostname = new URL(target).hostname;
        const path = new URL(target).pathname;
        console.log(hostname, path);
        const alist_resp = await fetch(
          'https://index.dustella.net/api/fs/get',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: `{"path":"${decodeURIComponent(path)}","password":""}`,
          },
        ).then((a) => a.json());
        const downUrl = alist_resp.data.raw_url;
        resp.status(302).redirect(downUrl);
      }
    }
  }
}

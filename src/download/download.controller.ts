import { Redirect } from '@nestjsplus/redirect';
import { Controller, Get, Query, Res } from '@nestjs/common';
import { DownloadService } from './donwload.service';
import { PrismaService } from 'src/prisma/prisma.service';

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

  @Get('/vscode')
  @Redirect()
  async getVscodeLink(@Res() resp) {
    const redi = await fetch(
      'https://code.visualstudio.com/sha/download?build=stable&os=win32-x64-user',
      // dont allow follow redirect
      {
        redirect: 'manual',
      },
    );

    const orignalUrl = redi.headers.get('location');
    // replace the original host string with https://vscode.cdn.azure.cn with regex that matches `https://xxx/`
    const target = orignalUrl.replace(
      /https:\/\/.*?\//,
      'https://vscode.cdn.azure.cn/',
    );
    console.log(target);
    resp.status(302).redirect(target);
  }
}

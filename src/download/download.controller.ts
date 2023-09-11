import { Redirect } from '@nestjsplus/redirect';
import { Controller, Get, Query, Res } from '@nestjs/common';
import { DownloadService } from './donwload.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { compareVersions } from 'compare-versions';

@Controller('/api/preview')
export class PreviewController {
  constructor(
    private prisma: PrismaService,
    private downloader: DownloadService,
  ) {}

  @Get()
  @Redirect()
  async getPreview(@Query('metadata_id') id: string, @Res() resp) {
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
        viewCount: {
          increment: 1,
        },
      },
    });

    const metadata = item;
    resp.status(302).redirect(metadata.target);
  }
}

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
    resp.status(302).redirect(target);
  }

  @Get('/python')
  @Redirect()
  async getPythonLink(@Res() resp) {
    const res = await fetch('https://registry.npmmirror.com/-/binary/python/');
    const data = await res.json();
    const all = (data as { modified; name; url }[]).flat();
    const latest = all
      .filter((a) => a.name.startsWith('3'))
      .sort((a, b) => {
        const [version_a, version_b] = [a.name, b.name].map((a) =>
          a.replace('/', ''),
        );
        // the version is semver, so we can just compare them
        return compareVersions(version_b, version_a);
      })[0];
    const metadata = await fetch(latest.url).then((a) => a.json());
    const target = metadata.find((a) => a.name.endsWith('amd64.exe'));
    const url = target.url;

    resp.status(302).redirect(url);
  }
}

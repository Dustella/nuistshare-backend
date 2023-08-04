import { Injectable } from '@nestjs/common';

@Injectable()
export class DownloadService {
  async getDriverUrl(metadata: { driver: string; target: string }) {
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
        return downUrl;
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
        return downUrl;
      }
    }
  }
}

// read targetLs.json and load it
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const source = JSON.parse(fs.readFileSync('datawork/targetLs.json', 'utf8'));

const data = [];

for (const item of source) {
  const { l1_title, l2_title, title, href, uploader } = item;

  data.push({
    name: title,
    l1Class: l1_title,
    l2Class: l2_title,
    tags: [],
    downloadCount: 0,
    favCount: 0,
    viewCount: 0,
    metadata: {
      createMany: {
        data: [
          {
            target: href,
            driver: 'cloudreve',
            label: 'Infinity的云盘',
          },
        ],
      },
    },
    public: true,
    uploader: uploader ?? 'Infinity',
  });
}

const prisma = new PrismaClient();

for (const item of data) {
  await prisma.archive.create({
    data: item,
  });
}

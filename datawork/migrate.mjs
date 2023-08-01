// read targetLs.json and load it
import { PrismaClient, Prisma } from '@prisma/client';
import * as fs from 'fs';

const source = JSON.parse(fs.readFileSync('datawork/targetLs.json', 'utf8'));

const data = [];

for (const item of source) {
  const { l1_title, l2_title, title, href } = item;

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
            href,
            type: 'cloudreve',
          },
        ],
      },
    },
  });
}

const prisma = new PrismaClient();

for (const item of data) {
  await prisma.archive.create({
    data: item,
  });
}

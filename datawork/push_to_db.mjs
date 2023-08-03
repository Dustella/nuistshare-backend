import { PrismaClient } from '@prisma/client';

// read json from datawork/migration_data.json
import * as fs from 'fs';

const data = JSON.parse(
  fs.readFileSync('datawork/migration_data.json', 'utf8'),
);

const prisma = new PrismaClient();

for (const item of data) {
  await prisma.archive.create({
    data: item,
  });
}

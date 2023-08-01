import { Controller, Get, Param, Post, Query } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

@Controller('/api/archives')
export class ArchiveController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('/entries/:id')
  async getSingleEntry(@Param('id') id: number) {
    return await this.prisma.archive.findUnique({
      where: {
        // @ts-expect-error
        id: parseInt(id),
      },
    });
  }

  @Get('/entries')
  async getAllEntries(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('keyword') keyword?: string,
    @Query('l1_class') l1_class?: string,
    @Query('l2_class') l2_class?: string,
    @Query('type') type?: string,
  ) {
    const prismaQuery = {} as any;

    if (keyword) {
      prismaQuery.where = {
        OR: [
          {
            name: {
              contains: keyword,
            },
          },
          {
            l1Class: {
              contains: keyword,
            },
          },
          {
            l2Class: {
              contains: keyword,
            },
          },
        ],
      };
    }
    if (l1_class) {
      prismaQuery.where = {
        l1Class: {
          contains: l1_class,
        },
      };
    }
    if (l2_class) {
      prismaQuery.where = {
        l2Class: {
          contains: l2_class,
        },
      };
    }

    if (type) {
      prismaQuery.where = {
        type: {
          contains: type,
        },
      };
    }

    const res = await this.prisma.archive.findMany(prismaQuery);
    const totalItems = res.length;
    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);
    const totalPages = Math.ceil(totalItems / limitNum);
    const data = res.slice(offsetNum, offsetNum + limitNum);
    return {
      data,
      totalItems,
      totalPages,
    };
  }

  @Post()
  async addSingleEntry() {}

  @Post('/viewed/:id')
  async addCount(@Param('id') id: string) {
    const res = await this.prisma.archive.update({
      where: {
        id: parseInt(id),
      },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
    return res;
  }
}

import { Controller, Get, Param, Post, Query } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

@Controller('/api/archives')
export class ArchiveController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('/entries/:id')
  async getSingleEntry(@Param('id') id: string) {
    return await this.prisma.archive.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        metadata: {
          select: {
            id: true,
            label: true,
          },
        },
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
      const l1_list = l1_class?.split(',');
      prismaQuery.where = {
        l1Class: {
          in: l1_list,
        },
      };
    }
    if (l2_class) {
      const l2_list = l2_class?.split(',');
      prismaQuery.where = {
        l2Class: {
          in: l2_list,
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
    if (!limit && !offset) {
      return res;
    }
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
  async addSingleEntry() {
    return 'Not Implemented';
  }

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

  @Get('/groups')
  async getGroups() {
    const res = await this.prisma.archive.findMany({
      select: {
        l1Class: true,
        l2Class: true,
      },
      distinct: ['l1Class', 'l2Class'],
    });
    return res;
  }
}

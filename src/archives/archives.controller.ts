import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Body,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Archive } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('/api/archives')
export class ArchiveController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('/entries/:id')
  async getSingleEntry(@Param('id') id: string) {
    await this.prisma.archive.update({
      where: {
        id: parseInt(id),
      },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
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
        Comments: {
          include: {
            user: {
              select: {
                name: true,
                nickname: true,
                id: true,
                avatar: true,
                verified: true,
              },
            },
          },
        },
      },
    });
  }
  @UseGuards(AuthGuard)
  @Post('/comment/:id')
  async addComment(
    @Param('id') id: string,
    @Body() body: { content: string },
    @Req() req: any,
  ) {
    const { sub } = req.user;
    const res = await this.prisma.comments.create({
      data: {
        content: body.content,
        user: {
          connect: {
            id: sub,
          },
        },
        archive: {
          connect: {
            id: parseInt(id),
          },
        },
      },
    });
    return res;
  }

  @Get('/entries')
  async getAllEntries(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('keyword') keyword?: string,
    @Query('l2_class') l2_class?: string,
    @Query('type') type?: string,
  ) {
    const prismaQuery = { where: {} } as any;

    if (keyword) {
      const containKeyword = { contains: keyword };
      prismaQuery.where.OR = [
        { name: containKeyword },
        { l1Class: containKeyword },
        { l2Class: containKeyword },
      ];
    }
    if (l2_class) {
      const l2_list = l2_class?.split(',');
      prismaQuery.where.l2Class = { in: l2_list };
    }
    if (type) {
      prismaQuery.where.type = { contains: type };
    }

    const res = await this.prisma.archive.findMany({
      ...prismaQuery,
      include: {
        metadata: {
          select: { id: true, label: true },
        },
      },
    });

    const totalItems = res.length;
    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);
    const totalPages = Math.ceil(totalItems / limitNum);

    if (!limit && !offset) {
      return { data: res, totalItems, totalPages };
    }

    const data = res.slice(offsetNum, offsetNum + limitNum);
    return { data, totalItems, totalPages };
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

  @UseGuards(AuthGuard)
  @Post('/entry')
  async addRecord(@Req() req: any, @Body() body: Archive) {
    const { sub } = req.user;
    const user = await this.prisma.users.findUnique({
      where: { id: sub },
    });
    if (user.verified) {
      const res = await this.prisma.archive.create({
        data: {
          ...body,
        },
      });
      return res;
    } else {
      throw new HttpException('Not Verified', HttpStatus.UNAUTHORIZED);
    }
  }
}

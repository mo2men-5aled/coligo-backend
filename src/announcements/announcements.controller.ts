// src/announcements/announcements.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Request } from '@nestjs/common';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post()
  async create(
    @Body() createAnnouncementDto: CreateAnnouncementDto,
    @Request() req,
  ) {
    const announcement = await this.announcementsService.create({
      ...createAnnouncementDto,
      createdBy: req.user.userId,
    });
    return {
      result: announcement,
      message: 'Announcement created successfully',
    };
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const { data, total } =
      await this.announcementsService.findAllPaginated(paginationDto);
    return {
      result: data,
      meta: {
        page: paginationDto.page,
        limit: paginationDto.limit,
        totalItems: total,
        totalPages: Math.ceil(total / (paginationDto.limit ?? 10)),
      },
      message: 'Announcements retrieved successfully',
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const announcement = await this.announcementsService.findOne(id);
    return {
      result: announcement,
      message: 'Announcement retrieved successfully',
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
  ) {
    const updated = await this.announcementsService.update(
      id,
      updateAnnouncementDto,
    );
    return {
      result: updated,
      message: 'Announcement updated successfully',
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.announcementsService.remove(id);
    return {
      result: null,
      message: 'Announcement deleted successfully',
    };
  }
}

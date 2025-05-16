import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Announcement,
  AnnouncementDocument,
} from './schemas/announcement.schema';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectModel(Announcement.name)
    private announcementModel: Model<AnnouncementDocument>,
  ) {}

  async create(
    createAnnouncementDto: CreateAnnouncementDto,
  ): Promise<Announcement> {
    const createdAnnouncement = new this.announcementModel(
      createAnnouncementDto,
    );
    return createdAnnouncement.save();
  }

  async findAll(): Promise<Announcement[]> {
    return this.announcementModel.find().exec();
  }

  async findOne(id: string): Promise<Announcement> {
    const announcement = await this.announcementModel.findById(id).exec();
    if (!announcement) throw new NotFoundException('Announcement not found');
    return announcement;
  }

  async update(
    id: string,
    updateAnnouncementDto: UpdateAnnouncementDto,
  ): Promise<Announcement> {
    const updated = await this.announcementModel.findByIdAndUpdate(
      id,
      updateAnnouncementDto,
      {
        new: true,
      },
    );
    if (!updated) throw new NotFoundException('Announcement not found');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.announcementModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Announcement not found');
  }
}

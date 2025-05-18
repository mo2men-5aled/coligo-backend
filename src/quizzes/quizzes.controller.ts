// src/quizzes/quizzes.controller.ts
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
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Request } from '@nestjs/common';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  async create(@Body() createQuizDto: CreateQuizDto, @Request() req) {
    const quiz = await this.quizzesService.create({
      ...createQuizDto,
      createdBy: req.user.userId as string,
    });
    return {
      result: quiz,
      message: 'Quiz created successfully',
    };
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const { data, total } =
      await this.quizzesService.findAllPaginated(paginationDto);
    return {
      result: data,
      meta: {
        page: paginationDto.page,
        limit: paginationDto.limit,
        totalItems: total,
        totalPages: Math.ceil(total / (paginationDto.limit ?? 10)),
      },
      message: 'Quizzes retrieved successfully',
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const quiz = await this.quizzesService.findOne(id);
    return {
      result: quiz,
      message: 'Quiz retrieved successfully',
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
    const updatedQuiz = await this.quizzesService.update(id, updateQuizDto);
    return {
      result: updatedQuiz,
      message: 'Quiz updated successfully',
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.quizzesService.remove(id);
    return {
      result: null,
      message: 'Quiz deleted successfully',
    };
  }
}

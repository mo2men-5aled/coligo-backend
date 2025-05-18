import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz, QuizDocument } from './schemas/quiz.schema';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class QuizzesService {
  constructor(@InjectModel(Quiz.name) private quizModel: Model<QuizDocument>) {}

  async create(createQuizDto: CreateQuizDto): Promise<Quiz> {
    const createdQuiz = new this.quizModel(createQuizDto);
    return createdQuiz.save();
  }

  async findAll(): Promise<Quiz[]> {
    return this.quizModel.find().exec();
  }

  async findAllPaginated(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.quizModel.find().skip(skip).limit(limit).exec(),
      this.quizModel.countDocuments().exec(),
    ]);

    return { data, total };
  }

  async findOne(id: string): Promise<Quiz> {
    const quiz = await this.quizModel.findById(id).exec();
    if (!quiz) throw new NotFoundException('Quiz not found');
    return quiz;
  }

  async update(id: string, updateQuizDto: UpdateQuizDto): Promise<Quiz> {
    const updated = await this.quizModel.findByIdAndUpdate(id, updateQuizDto, {
      new: true,
    });
    if (!updated) throw new NotFoundException('Quiz not found');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.quizModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Quiz not found');
  }

  async findByCreator(userId: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.quizModel.find({ createdBy: userId }).skip(skip).limit(limit).exec(),
      this.quizModel.countDocuments({ createdBy: userId }).exec(),
    ]);

    return { data, total };
  }
}

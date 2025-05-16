import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { QuizzesController } from './quizzes/quizzes.controller';
import { QuizzesModule } from './quizzes/quizzes.module';

import { AnnouncementsModule } from './announcements/announcements.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI ||
        'mongodb+srv://momen:momen@cluster0.gtplyfa.mongodb.net/coligo',
    ),
    QuizzesModule,
    AnnouncementsModule,
    AuthModule,
  ],
  controllers: [AppController, QuizzesController],
  providers: [AppService],
})
export class AppModule {}

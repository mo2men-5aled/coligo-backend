import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { QuizzesController } from './quizzes/quizzes.controller';
import { QuizzesModule } from './quizzes/quizzes.module';

import { AnnouncementsModule } from './announcements/announcements.module';
import { AuthModule } from './auth/auth.module';
import { ResponseService } from './common/response/response.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    QuizzesModule,
    AnnouncementsModule,
    AuthModule,

    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController, QuizzesController],
  providers: [AppService, ResponseService],
})
export class AppModule {}

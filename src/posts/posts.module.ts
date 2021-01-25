import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { storage } from '../options/upload/cloudinary-storage.options';
import { fileFilter } from '../options/upload/multer.options';
import { AuthModule } from '../auth/auth.module';
import { OptionsModule } from '../options/options.module';
import { UsersModule } from '../users/users.module';
import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostsRepository]),
    AuthModule,
    UsersModule,
    OptionsModule,
    MulterModule.register({
      storage,
      fileFilter,
    }),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}

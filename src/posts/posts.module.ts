import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}

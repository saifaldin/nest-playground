import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { OptionsModule } from '../options/options.module';
import { UsersModule } from '../users/users.module';
import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';
import { UploadModule } from '../upload/upload.module';
import { UploadService } from 'src/upload/upload.service';
import { providers } from 'src/upload/providers/enum/providers.enum';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostsRepository]),
    AuthModule,
    UsersModule,
    OptionsModule,
    UploadModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule implements NestModule {
  constructor(private readonly uploadService: UploadService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(async (req, res, next) => {
        const files = await this.uploadService.uploadService(
          req,
          res,
          providers.CLOUDINARY,
        );
        // console.log(files);
        next();
      })
      .forRoutes({ path: '/posts', method: RequestMethod.POST });
  }
}

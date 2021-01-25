import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionsModule } from './options/options.module';
import typeOrmOpts from './orm.config';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    PostsModule,
    AuthModule,
    UsersModule,
    OptionsModule,
    TypeOrmModule.forRoot(typeOrmOpts),
    UploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

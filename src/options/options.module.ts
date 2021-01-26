import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionsRepository } from './options.repository';
import { OptionsService } from './options.service';
import { OptionsController } from './options.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OptionsRepository]),
    AuthModule,
    UsersModule,
  ],
  providers: [OptionsService],
  controllers: [OptionsController],
  exports: [OptionsService, TypeOrmModule.forFeature([OptionsRepository])],
})
export class OptionsModule {}

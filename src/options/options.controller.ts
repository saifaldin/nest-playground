import { Controller, Param, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/user.decorator';
import { Users } from '../users/users.entity';
import { OptionsService } from './options.service';

@Controller('options')
@UseGuards(AuthGuard('firebase-jwt'))
export class OptionsController {
  constructor(private optionsService: OptionsService) {}

  @Put('/:id')
  upvoteOption(@Param('id') optionId: number, @User() currentUser: Users) {
    return this.optionsService.upvoteOption(optionId, currentUser);
  }
}

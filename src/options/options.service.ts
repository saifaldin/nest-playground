import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/users.entity';
import { UsersRepository } from 'src/users/users.repository';
import { Options } from './options.entity';
import { OptionsRepository } from './options.repository';

@Injectable()
export class OptionsService {
  constructor(
    @InjectRepository(Options) private optionsRepository: OptionsRepository,
    @InjectRepository(Users) private usersRepository: UsersRepository,
  ) {}
  async upvoteOption(optionId: number, currentUser: Users) {
    let option = await this.optionsRepository.findOneOrFail(optionId, {
      relations: ['post'],
    });

    const hasAlreadyVoted = await this.usersRepository.hasAlreadyVoted(
      currentUser,
      option.post,
    );

    if (hasAlreadyVoted)
      throw new BadRequestException(
        'Currently signed in user has already voted on this post',
      );

    await this.usersRepository.addPostToVoted(currentUser, option.post);
    option = await this.optionsRepository.upvoteOption(option);
    return option;
  }
}

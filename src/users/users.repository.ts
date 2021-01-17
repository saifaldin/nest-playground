import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthCredentialsDto } from 'src/auth/auth-credentials.dto';
import { EntityRepository, Repository } from 'typeorm';
import { Users } from './users.entity';

@EntityRepository(Users)
export class UsersRepository extends Repository<Users> {
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<Users> {
    const { username, password } = authCredentialsDto;
    try {
      const newUser = new Users();
      newUser.username = username;
      newUser.password = password;
      await newUser.save();
      return newUser;
    } catch (error) {
      console.log(error);
      if (error.code === '23505')
        throw new ConflictException('Username already exists');
      else throw new InternalServerErrorException();
    }
  }
  async findUserByUsername(username: string): Promise<Users> {
    const user = await this.findOne({ where: { username } });
    return user;
  }
}

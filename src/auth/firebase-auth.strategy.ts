import {
  Headers,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-firebase-jwt';
import { auth } from 'firebase-admin';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/users.entity';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Users) private usersRepository: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(@Headers('Authorization') idToken: string) {
    try {
      const { name, email, picture } = await auth().verifyIdToken(idToken);
      const user = await this.usersRepository.findOne(
        { email },
        { relations: ['posts', 'votedPosts'] },
      );

      if (user) {
        return user;
      }

      const newUser = await this.usersRepository.createUser(
        name,
        email,
        picture,
      );

      return newUser;
    } catch (error) {
      if (error.code === 'auth/id-token-expired')
        throw new UnauthorizedException('Id Token expired');
      else throw new InternalServerErrorException();
    }
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from 'src/users/users.repository';
import { AuthCredentialsDto } from './auth-credentials.dto';
import { Users } from 'src/users/users.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}
  async signUp(authCredentialsDto: AuthCredentialsDto) {
    const newUser = await this.usersRepository.createUser(authCredentialsDto);
    return newUser;
  }
  async signIn(authCredentialsDto: AuthCredentialsDto) {
    const { username, password } = authCredentialsDto;
    const user = await this.usersRepository.findUserByUsername(username);
    if (!user || !(user.password === password))
      throw new UnauthorizedException('Invalid credentials');
    const payload = { username };
    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }
}

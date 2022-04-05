import * as bcrypt from 'bcrypt';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository, createUser } from './user.repository';

import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthResponse } from './auth-response.model';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  async signUp(authCredentialDto: AuthCredentialsDto): Promise<AuthResponse> {
    return await createUser(authCredentialDto);
  }

  async signIn(authCredentialDto: AuthCredentialsDto): Promise<AuthResponse> {
    const { username, password } = authCredentialDto;

    const user = await UserRepository.findOneBy({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };

      const jwtToken = await this.jwtService.sign(payload);
      return { status: '200', message: 'login successfully', jwtToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}

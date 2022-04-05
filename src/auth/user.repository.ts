import * as bcrypt from 'bcrypt';

import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

import { AppDataSource } from 'src';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthResponse } from './auth-response.model';
import { User } from './user.entity';

export const UserRepository = AppDataSource.getRepository(User);

export const createUser = async (
  authCredentialsDto: AuthCredentialsDto,
): Promise<AuthResponse> => {
  const { username, password } = authCredentialsDto;

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  const user = await UserRepository.create({
    username,
    password: hashPassword,
  });

  try {
    await UserRepository.save(user);
    return { status: '200', message: `${username} saved successfuly` };
  } catch (error) {
    if (error.code === '23505') {
      throw new ConflictException('User Already Exist');
    } else {
      throw new InternalServerErrorException();
    }
  }
};

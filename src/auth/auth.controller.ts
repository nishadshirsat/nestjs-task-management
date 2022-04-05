import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthResponse } from './auth-response.model';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCredDto: AuthCredentialsDto): Promise<AuthResponse> {
    return this.authService.signUp(authCredDto);
  }

  @Post('/signin')
  signIn(@Body() authCredDto: AuthCredentialsDto): Promise<AuthResponse> {
    return this.authService.signIn(authCredDto);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@Req() req) {
    console.log(req);
  }
}

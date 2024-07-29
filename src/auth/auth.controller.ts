import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { BearerToken } from './security/bearer-token.decorator';
import { UseAuth } from './security/use-auth.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user and get access token
   */
  @Post('/register')
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(registerUserDto);
    res.setHeader('Authorization', `Bearer ${result.access_token}`);
    return result;
  }

  /**
   * Login and get an access token
   */
  @HttpCode(200)
  @Post('/login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginUserDto);
    res.setHeader('Authorization', `Bearer ${result.access_token}`);
    return result;
  }

  /**
   * Refresh an access token using a refresh token
   */
  @UseAuth()
  @HttpCode(200)
  @Post('/refreshToken')
  refreshToken(
    @BearerToken() token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = this.authService.refreshToken(token);
    res.setHeader('Authorization', `Bearer ${result.access_token}`);
    return result;
  }
}

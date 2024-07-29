import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '@src/common/database.service';
import { compare, hash } from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthResponse } from './entities/auth-response.entity';
import { JwtPayload } from './entities/jwt-payload.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private dbService: DatabaseService,
  ) {}

  async register(createAuthDto: RegisterUserDto) {
    const userExists = await this.dbService.user.findUnique({
      where: {
        username: createAuthDto.username,
      },
    });

    if (userExists) {
      throw new HttpException('User already exists', 400);
    }

    const hashedPassword = await hash(createAuthDto.password, 10);

    const user = await this.dbService.user.create({
      data: {
        username: createAuthDto.username,
        password: hashedPassword,
        age: createAuthDto.age,
      },
    });

    return new AuthResponse({
      access_token: this.jwtService.sign(
        new JwtPayload({ sub: user.id }).toPlainObject(),
      ),
    });
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.dbService.user.findUnique({
      where: {
        username: loginUserDto.username,
      },
    });

    if (!user) {
      throw new HttpException('Invalid username or password', 400);
    }

    const passwordMatch = await compare(loginUserDto.password, user.password);

    if (!passwordMatch) {
      throw new HttpException('Invalid username or password', 400);
    }

    return new AuthResponse({
      access_token: this.jwtService.sign(
        new JwtPayload({ sub: user.id }).toPlainObject(),
      ),
    });
  }

  refreshToken(access_token: string) {
    try {
      const payload: JwtPayload = this.jwtService.verify(
        access_token.split(' ')[1],
      );

      return new AuthResponse({
        access_token: this.jwtService.sign(
          new JwtPayload({ sub: payload.sub }).toPlainObject(),
        ),
      });
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { DatabaseService } from '@src/common/database.service';
import { RequestUser } from '@src/common/user.decorator';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../entities/jwt-payload.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private dbService: DatabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.dbService.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, role: true, age: true },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return { ...payload, ...user } satisfies RequestUser;
  }
}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/security/jwt.strategy';
import { DatabaseModule } from './common/database.module';
import { MovieModule } from './movie/movie.module';
import { SessionModule } from './session/session.module';
import { UserSessionModule } from './user-session/user-session.module';

export const BaseModuleImports = [
  ConfigModule.forRoot({
    envFilePath: ['.env'],
    isGlobal: true,
  }),
  PassportModule,
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '4h' },
    global: true,
  }),
  DatabaseModule,
];

@Module({
  imports: [...BaseModuleImports, AuthModule, MovieModule, SessionModule, UserSessionModule],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}

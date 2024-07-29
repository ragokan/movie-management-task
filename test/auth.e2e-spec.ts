import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUserDto } from '@src/auth/dto/register-user.dto';
import { instanceToPlain } from 'class-transformer';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const testUser = new RegisterUserDto({
    username: 'teste2e',
    password: 'teste2e',
    age: 20,
  });
  let access_token: string | null = null;

  describe('create acc', () => {
    it('/register (POST)', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(instanceToPlain(testUser))
        .expect(201)
        .expect((res) => {
          expect(res.body.access_token).toBeDefined();
        });
    });
  });

  describe('login', () => {
    it('/login (POST)', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send(instanceToPlain(testUser))
        .expect(200)
        .expect((res) => {
          expect(res.body.access_token).toBeDefined();
          access_token = res.body.access_token;
        });
    });
  });

  describe('refresh token', () => {
    it('/refreshToken (POST)', async () => {
      await request(app.getHttpServer())
        .post('/auth/refreshToken')
        .set('Authorization', `Bearer ${access_token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.access_token).toBeDefined();
          access_token = res.body.access_token;
        });
    });
  });
});

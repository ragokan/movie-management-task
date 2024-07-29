import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { instanceToPlain } from 'class-transformer';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AppService } from './../src/app.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200, instanceToPlain(app.get(AppService).getServerStatus()));
  });
});

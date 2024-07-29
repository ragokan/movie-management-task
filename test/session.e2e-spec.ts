import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from '@prisma/client';
import { AppModule } from '@src/app.module';
import { AuthService } from '@src/auth/auth.service';
import { DatabaseService } from '@src/common/database.service';
import { CreateSessionDto } from '@src/session/dto/create-session.dto';
import { SessionEntity } from '@src/session/entities/session.entity';
import { instanceToPlain } from 'class-transformer';
import * as request from 'supertest';

describe('SessionController (e2e)', () => {
  let app: INestApplication;
  let user_access_token: string | null = null;
  let manager_access_token: string | null = null;
  let movie_id: number | null = null;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, errorHttpStatusCode: 400 }),
    );
    await app.init();

    const authService = app.get(AuthService);
    const dbService = app.get(DatabaseService);

    const user = await authService.register({
      username: 'usersessioncreatetest',
      password: 'usersessioncreatetest',
      age: 20,
    });
    user_access_token = user.access_token;

    const manager = await authService.register({
      username: 'managersessioncreatetest',
      password: 'managersessioncreatetest',
      age: 20,
    });
    manager_access_token = manager.access_token;
    await dbService.user.update({
      data: { role: UserRole.MANAGER },
      where: { username: 'managersessioncreatetest' },
    });

    const movie = await dbService.movie.create({
      data: { name: 'Test Movie', ageRestriction: 'GT18' },
    });
    movie_id = movie.id;
  });

  describe('tests', () => {
    const testSession = new CreateSessionDto({
      movieId: movie_id,
      date: new Date(),
      durationInMinutes: 120,
      roomNumber: 1,
    });
    let createdTestSession: SessionEntity | null = null;

    describe('create session without authentication', () => {
      it('/session (POST)', async () => {
        await request(app.getHttpServer())
          .post('/session')
          .send(instanceToPlain(testSession))
          .expect(401);
      });
    });

    describe('create session without permission', () => {
      it('/session (POST)', async () => {
        await request(app.getHttpServer())
          .post('/session')
          .set('Authorization', `Bearer ${user_access_token}`)
          .send(instanceToPlain(testSession))
          .expect(403);
      });
    });

    describe('create session with wrong data', () => {
      it('/session (POST)', async () => {
        await request(app.getHttpServer())
          .post('/session')
          .set('Authorization', `Bearer ${manager_access_token}`)
          .send({ title: 'test' })
          .expect(400);

        await request(app.getHttpServer())
          .post('/session')
          .set('Authorization', `Bearer ${manager_access_token}`)
          .send({ ...instanceToPlain(testSession), date: 'wrong' })
          .expect(400);
      });
    });

    describe('create session', () => {
      it('/session (POST)', async () => {
        testSession.movieId = movie_id;
        const response = await request(app.getHttpServer())
          .post('/session')
          .set('Authorization', `Bearer ${manager_access_token}`)
          .send(instanceToPlain(testSession))
          .expect(201);
        expect(response.body.id).toBeDefined();
        expect(response.body.movie.id).toBe(movie_id);
        expect(response.body.date).toBe(testSession.date.toISOString());
        expect(response.body.durationInMinutes).toBe(
          testSession.durationInMinutes,
        );
        expect(response.body.roomNumber).toBe(testSession.roomNumber);
        createdTestSession = response.body;
      });
    });

    describe('find all sessions', () => {
      it('/session (GET)', async () => {
        await request(app.getHttpServer())
          .get('/session')
          .expect(200)
          .expect((res) => {
            expect(res.body).toEqual([createdTestSession]);
          });
      });
    });

    describe('find one session', () => {
      it('/session/:id (GET)', async () => {
        await request(app.getHttpServer())
          .get(`/session/${createdTestSession.id}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toEqual(createdTestSession);
          });
      });
    });

    describe('update session', () => {
      it('/session/:id (PATCH)', async () => {
        await request(app.getHttpServer())
          .patch(`/session/${createdTestSession.id}`)
          .set('Authorization', `Bearer ${manager_access_token}`)
          .send({ roomNumber: 2 })
          .expect(200)
          .expect((res) => {
            expect(2).toEqual(res.body.roomNumber);
            createdTestSession = res.body;
          });
      });
    });

    describe('delete session', () => {
      it('/session/:id (DELETE)', async () => {
        await request(app.getHttpServer())
          .delete(`/session/${createdTestSession.id}`)
          .set('Authorization', `Bearer ${manager_access_token}`)
          .expect(200);

        await request(app.getHttpServer())
          .get(`/session/${createdTestSession.id}`)
          .expect(404);
      });
    });
  });
});

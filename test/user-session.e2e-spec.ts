import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { AuthService } from '@src/auth/auth.service';
import { DatabaseService } from '@src/common/database.service';
import * as request from 'supertest';

describe('UserSessionController (e2e)', () => {
  let app: INestApplication;
  let user_access_token: string | null = null;
  let movie_id: number | null = null;
  let session_id: number | null = null;

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

    const movie = await dbService.movie.create({
      data: { name: 'Test Movie', ageRestriction: 'GT18' },
    });
    movie_id = movie.id;

    const session = await dbService.session.create({
      data: {
        date: new Date(),
        durationInMinutes: 120,
        movieId: movie.id,
        roomNumber: 1,
      },
    });
    session_id = session.id;
  });

  describe('tests', () => {
    let created_user_session_id: number | null = null;

    it('should create user session', async () => {
      return request(app.getHttpServer())
        .post('/user-session')
        .set('Authorization', `Bearer ${user_access_token}`)
        .send({
          sessionId: session_id,
        })
        .expect(201)
        .then((r) => {
          created_user_session_id = r.body.id;
        });
    });

    it('should find all user sessions', async () => {
      return request(app.getHttpServer())
        .get('/user-session')
        .set('Authorization', `Bearer ${user_access_token}`)
        .expect(200)
        .expect((r) => {
          expect(r.body).toBeInstanceOf(Array);
          expect(r.body.length).toBeGreaterThan(0);
          expect(
            r.body.some((s: any) => s.id === created_user_session_id),
          ).toBe(true);
        });
    });

    it('should delete user session', async () => {
      return request(app.getHttpServer())
        .delete(`/user-session/${created_user_session_id}`)
        .set('Authorization', `Bearer ${user_access_token}`)
        .expect(200);
    });
  });
});

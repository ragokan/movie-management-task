import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from '@prisma/client';
import { AppModule } from '@src/app.module';
import { AuthService } from '@src/auth/auth.service';
import { DatabaseService } from '@src/common/database.service';
import { CreateMovieDto } from '@src/movie/dto/create-movie.dto';
import { UpdateMovieDto } from '@src/movie/dto/update-movie.dto';
import { MovieEntity } from '@src/movie/entities/movie.entity';
import { instanceToPlain } from 'class-transformer';
import * as request from 'supertest';

describe('MovieController (e2e)', () => {
  let app: INestApplication;
  let user_access_token: string | null = null;
  let manager_access_token: string | null = null;

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
      username: 'usermoviecreatetest',
      password: 'usermoviecreatetest',
      age: 20,
    });
    user_access_token = user.access_token;

    const manager = await authService.register({
      username: 'managermoviecreatetest',
      password: 'managermoviecreatetest',
      age: 20,
    });
    manager_access_token = manager.access_token;
    await dbService.user.update({
      data: { role: UserRole.MANAGER },
      where: { username: 'managermoviecreatetest' },
    });
  });

  const testMovie = new CreateMovieDto({
    name: 'test',
    ageRestriction: 'GT18',
  });
  let createdTestMovie: MovieEntity | null = null;

  describe('create movie without authentication', () => {
    it('/movie (POST)', async () => {
      await request(app.getHttpServer())
        .post('/movie')
        .send(instanceToPlain(testMovie))
        .expect(401);
    });
  });

  describe('create movie without permission', () => {
    it('/movie (POST)', async () => {
      await request(app.getHttpServer())
        .post('/movie')
        .set('Authorization', `Bearer ${user_access_token}`)
        .send(instanceToPlain(testMovie))
        .expect(403);
    });
  });

  describe('create movie with wrong data', () => {
    it('/movie (POST)', async () => {
      await request(app.getHttpServer())
        .post('/movie')
        .set('Authorization', `Bearer ${manager_access_token}`)
        .send({ title: 'test' })
        .expect(400);

      await request(app.getHttpServer())
        .post('/movie')
        .set('Authorization', `Bearer ${manager_access_token}`)
        .send({ ...testMovie, ageRestriction: 'wrong' })
        .expect(400);
    });
  });

  describe('create movie', () => {
    it('/movie (POST)', async () => {
      await request(app.getHttpServer())
        .post('/movie')
        .set('Authorization', `Bearer ${manager_access_token}`)
        .send(instanceToPlain(testMovie))
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBeDefined();
          expect(res.body.name).toBe(testMovie.name);
          expect(res.body.ageRestriction).toBe(testMovie.ageRestriction);
          createdTestMovie = res.body;
        });
    });
  });

  describe('find all movies', () => {
    it('/movie (GET)', async () => {
      await request(app.getHttpServer())
        .get('/movie')
        .set('Authorization', `Bearer ${user_access_token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body.some((m) => m.name === testMovie.name)).toBe(true);
        });
    });
  });

  describe('find one movie', () => {
    it('/movie/:id (GET)', async () => {
      await request(app.getHttpServer())
        .get(`/movie/${createdTestMovie.id}`)
        .set('Authorization', `Bearer ${manager_access_token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBeDefined();
          expect(res.body.id).toBe(createdTestMovie.id);
          expect(res.body.name).toBe(testMovie.name);
          expect(res.body.ageRestriction).toBe(testMovie.ageRestriction);
        });
    });
  });

  describe('update movie', () => {
    it('/movie/:id (PATCH)', async () => {
      const updatedTestMovie = new UpdateMovieDto({
        name: 'test updated',
        ageRestriction: 'GT18',
      });
      await request(app.getHttpServer())
        .patch(`/movie/${createdTestMovie.id}`)
        .set('Authorization', `Bearer ${manager_access_token}`)
        .send(instanceToPlain(updatedTestMovie))
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBeDefined();
          expect(res.body.id).toBe(createdTestMovie.id);
          expect(res.body.name).toBe(updatedTestMovie.name);
          expect(res.body.ageRestriction).toBe(updatedTestMovie.ageRestriction);
          createdTestMovie = res.body;
        });
    });
  });

  describe('delete movie', () => {
    it('/movie/:id (DELETE)', async () => {
      await request(app.getHttpServer())
        .delete(`/movie/${createdTestMovie.id}`)
        .set('Authorization', `Bearer ${manager_access_token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
        });
    });
  });
});

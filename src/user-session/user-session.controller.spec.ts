import { Test, TestingModule } from '@nestjs/testing';
import { BaseModuleImports } from '@src/app.module';
import { DatabaseService } from '@src/common/database.service';
import { RequestUser } from '@src/common/user.decorator';
import { CreateUserSessionDto } from './dto/create-user-session.dto';
import { UserSessionEntity } from './entities/user-session.entity';
import { UserSessionController } from './user-session.controller';
import { UserSessionService } from './user-session.service';

describe('UserSessionController', () => {
  let controller: UserSessionController;
  let testMovieId: number | null = null;
  let testSessionId: number | null = null;
  let user: RequestUser | null = null;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: BaseModuleImports,
      controllers: [UserSessionController],
      providers: [UserSessionService],
    }).compile();

    controller = module.get<UserSessionController>(UserSessionController);

    const dbService = module.get<DatabaseService>(DatabaseService);
    user = await dbService.user.create({
      data: {
        username: 'testusersession',
        password: 'testusersession',
      },
    });
    const movie = await dbService.movie.create({
      data: { name: 'Test Movie', ageRestriction: 'GT18' },
    });
    testMovieId = movie.id;
    const session = await dbService.session.create({
      data: {
        date: new Date(),
        durationInMinutes: 120,
        movieId: movie.id,
        roomNumber: 1,
      },
    });
    testSessionId = session.id;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  function testUserSession() {
    return new CreateUserSessionDto({
      sessionId: testSessionId,
    });
  }
  let createdTestUserSession: UserSessionEntity | null = null;

  describe('create', () => {
    it('should create user session', async () => {
      const createResult = await controller.create(testUserSession(), user);
      expect(createResult).toHaveProperty('id');
      expect(createResult.session.id).toBe(testSessionId);
      createdTestUserSession = createResult;
    });
  });

  describe('findAll', () => {
    it('should find all user sessions', async () => {
      const findAllResult = await controller.findAll(user);
      expect(findAllResult).toBeInstanceOf(Array);
      expect(findAllResult.length).toBeGreaterThan(0);
      expect(
        findAllResult.some((s) => s.id === createdTestUserSession!.id),
      ).toBe(true);
    });
  });

  describe('delete', () => {
    it('should delete user session', async () => {
      await controller.remove(createdTestUserSession!.id, user);
      const findAllResult = await controller.findAll(user);
      expect(
        findAllResult.some((s) => s.id === createdTestUserSession!.id),
      ).toBe(false);
    });
  });
});

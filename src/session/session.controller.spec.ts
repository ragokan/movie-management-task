import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AgeRestriction, Movie } from '@prisma/client';
import { BaseModuleImports } from '@src/app.module';
import { DatabaseService } from '@src/common/database.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionEntity } from './entities/session.entity';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';

describe('SessionController', () => {
  let controller: SessionController;
  let testMovie: Movie | null = null;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: BaseModuleImports,
      controllers: [SessionController],
      providers: [SessionService],
    }).compile();

    controller = module.get<SessionController>(SessionController);

    testMovie = await module
      .get<DatabaseService>(DatabaseService)
      .movie.create({
        data: { name: 'Test Movie', ageRestriction: AgeRestriction.GT18 },
      });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  function getTestSession() {
    expect(testMovie).toBeDefined();
    return new CreateSessionDto({
      date: new Date(),
      durationInMinutes: 120,
      movieId: testMovie!.id,
      roomNumber: 1,
    });
  }
  let createdTestSession: Omit<SessionEntity, 'movie'> | null = null;

  describe('create', () => {
    it('should create session', async () => {
      const createResult = await controller.create(getTestSession());
      expect(createResult).toHaveProperty('id');
      expect(createResult.date).toBeInstanceOf(Date);
      expect(createResult.durationInMinutes).toBe(120);
      expect(createResult.roomNumber).toBe(1);
      expect(createResult.movie.id).toBe(testMovie!.id);
      createdTestSession = createResult;
    });
  });

  describe('findAll', () => {
    it('should find all sessions', async () => {
      const findAllResult = await controller.findAll();
      expect(findAllResult).toBeInstanceOf(Array);
      expect(findAllResult.length).toBeGreaterThan(0);
      expect(findAllResult.some((s) => s.id === createdTestSession!.id)).toBe(
        true,
      );
    });
  });

  describe('findOne', () => {
    it('should find one session', async () => {
      const findOneResult = await controller.findOne(createdTestSession!.id);
      expect(findOneResult).toHaveProperty('id');
      expect(findOneResult.id).toBe(createdTestSession!.id);
      expect(findOneResult.date).toBeInstanceOf(Date);
      expect(findOneResult.durationInMinutes).toBe(120);
      expect(findOneResult.roomNumber).toBe(1);
      expect(findOneResult.movie.id).toBe(testMovie!.id);
    });
  });

  describe('findAllForTheDay', () => {
    it('should find all sessions for the day', async () => {
      const findAllForTheDayResult = await controller.findAllForTheDay({
        date: new Date(),
      });
      expect(findAllForTheDayResult).toBeInstanceOf(Array);
      expect(findAllForTheDayResult.length).toBeGreaterThan(0);
      expect(
        findAllForTheDayResult.some((s) => s.id === createdTestSession!.id),
      ).toBe(true);
    });
  });

  describe('update', () => {
    it('should update session', async () => {
      const updateResult = await controller.update(createdTestSession!.id, {
        roomNumber: 2,
      });
      expect(updateResult).toHaveProperty('id');
      expect(updateResult.id).toBe(createdTestSession!.id);
      expect(updateResult.date).toBeInstanceOf(Date);
      expect(updateResult.durationInMinutes).toBe(120);
      expect(updateResult.roomNumber).toBe(2);
      expect(updateResult.movie.id).toBe(testMovie!.id);
      createdTestSession!.roomNumber = 2;
    });
  });

  describe('delete', () => {
    it('should delete session', async () => {
      const deleteResult = await controller.remove(createdTestSession!.id);
      expect(deleteResult.success).toBe(true);
      try {
        await controller.findOne(createdTestSession!.id);
        throw new Error('Session is not deleted');
      } catch (e) {
        expect(e.message).toBe('Session is not found');
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
});

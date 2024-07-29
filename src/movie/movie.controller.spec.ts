import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AgeRestriction } from '@prisma/client';
import { BaseModuleImports } from '@src/app.module';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieEntity } from './entities/movie.entity';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';

describe('MovieController', () => {
  let controller: MovieController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: BaseModuleImports,
      controllers: [MovieController],
      providers: [MovieService],
    }).compile();

    controller = module.get<MovieController>(MovieController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  const testMovie = new CreateMovieDto({
    name: 'test',
    ageRestriction: AgeRestriction.GT18,
  });
  let createdTestMovie: MovieEntity | null = null;

  describe('create', () => {
    it('should create movie', async () => {
      const createResult = await controller.create(testMovie);
      expect(createResult).toHaveProperty('id');
      expect(createResult.name).toBe(testMovie.name);
      expect(createResult.ageRestriction).toBe(testMovie.ageRestriction);
      createdTestMovie = createResult;
    });
  });

  describe('findAll', () => {
    it('should find all movies', async () => {
      const findAllResult = await controller.findAll();
      expect(findAllResult).toBeInstanceOf(Array);
      expect(findAllResult.length).toBeGreaterThan(0);
      expect(findAllResult.some((m) => m.name === testMovie.name)).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should find one movie', async () => {
      const findOneResult = await controller.findOne(createdTestMovie.id);
      expect(findOneResult).toHaveProperty('id');
      expect(findOneResult.id).toBe(createdTestMovie.id);
      expect(findOneResult.name).toBe(testMovie.name);
      expect(findOneResult.ageRestriction).toBe(testMovie.ageRestriction);
    });
  });

  describe('update', () => {
    it('should update movie', async () => {
      const updateResult = await controller.update(
        createdTestMovie.id,
        new UpdateMovieDto({ name: 'updated' }),
      );
      expect(updateResult).toHaveProperty('id');
      expect(updateResult.id).toBe(createdTestMovie.id);
      expect(updateResult.name).toBe('updated');
      expect(updateResult.ageRestriction).toBe(testMovie.ageRestriction);
      createdTestMovie.name = 'updated';
    });
  });

  describe('delete', () => {
    it('should delete movie', async () => {
      const deleteResult = await controller.remove(createdTestMovie.id);
      expect(deleteResult.success).toBe(true);
      try {
        await controller.findOne(createdTestMovie.id);
        throw new Error('Movie is not deleted');
      } catch (e) {
        expect(e.message).toBe('Movie is not found');
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
});

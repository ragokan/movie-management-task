import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@src/common/database.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MovieService {
  constructor(private readonly dbService: DatabaseService) {}

  async create(createMovieDto: CreateMovieDto) {
    return await this.dbService.movie.create({
      data: createMovieDto,
    });
  }

  async findAll() {
    return await this.dbService.movie.findMany();
  }

  async findOne(id: number) {
    try {
      return await this.dbService.movie.findUniqueOrThrow({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('Movie is not found');
    }
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    try {
      return await this.dbService.movie.update({
        where: { id },
        data: updateMovieDto,
      });
    } catch (error) {
      throw new NotFoundException('Movie is not found');
    }
  }

  async remove(id: number) {
    try {
      await this.dbService.movie.delete({
        where: { id },
      });
      return { success: true };
    } catch (error) {
      throw new NotFoundException('Movie is not found');
    }
  }

  async bulkAdd(data: CreateMovieDto[]) {
    await this.dbService.movie.createMany({
      data,
    });
    return { success: true };
  }
}

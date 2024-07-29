import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UseAuth } from '@src/auth/security/use-auth.decorator';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieEntity } from './entities/movie.entity';
import { MovieService } from './movie.service';

@ApiTags('movie')
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  /*
   * Create a new movie.
   * Only managers can create movies.
   */
  @Post()
  @UseAuth('MANAGER')
  create(@Body() createMovieDto: CreateMovieDto): Promise<MovieEntity> {
    return this.movieService.create(createMovieDto);
  }

  /*
   * Get all movies.
   */
  @Get()
  findAll(): Promise<MovieEntity[]> {
    return this.movieService.findAll();
  }

  /*
   * Get a movie by ID.
   * @param id - The ID of the movie.
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<MovieEntity> {
    return this.movieService.findOne(id);
  }

  /*
   * Update a movie by ID.
   * @param id - The ID of the movie.
   * @param updateMovieDto - The updated movie data.
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<MovieEntity> {
    return this.movieService.update(id, updateMovieDto);
  }

  /*
   * Delete a movie by ID.
   * @param id - The ID of the movie.
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.movieService.remove(id);
  }

  /*
   * Add multiple movies.
   * Only managers can add multiple movies.
   */
  @Post('bulkAdd')
  @UseAuth('MANAGER')
  bulkAdd(@Body() createMovieDto: CreateMovieDto[]) {
    return this.movieService.bulkAdd(createMovieDto);
  }
}

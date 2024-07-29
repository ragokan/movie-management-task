import { PartialType } from '@nestjs/swagger';
import { CreateMovieDto } from './create-movie.dto';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
  constructor(partial: Partial<UpdateMovieDto>) {
    super();
    Object.assign(this, partial);
  }
}

import { MovieEntity } from '@src/movie/entities/movie.entity';

export class SessionEntity {
  id: number;
  date: Date;
  durationInMinutes: number;
  roomNumber: number;

  movie: MovieEntity;
}

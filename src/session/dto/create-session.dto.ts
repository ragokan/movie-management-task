import { Transform } from 'class-transformer';
import { IsDate, IsDefined, IsPositive } from 'class-validator';

export class CreateSessionDto {
  @IsDate({ message: 'Please provide a valid date' })
  @IsDefined({ message: 'Please provide a date' })
  @Transform(({ value }) =>
    typeof value === 'string' ? new Date(value) : value,
  )
  date: Date;

  @IsDefined({ message: 'Please provide a duration' })
  @IsPositive({ message: 'Please provide a positive duration' })
  durationInMinutes: number;

  @IsDefined({ message: 'Please provide a room number' })
  @IsPositive({ message: 'Please provide a positive room number' })
  roomNumber: number;

  @IsDefined({ message: 'Please provide a movie ID' })
  movieId: number;

  constructor(partial: Partial<CreateSessionDto>) {
    Object.assign(this, partial);
  }
}

import { IsDate, IsDefined } from 'class-validator';

export class SessionsForDayDto {
  @IsDate({ message: 'Please provide a valid date' })
  @IsDefined({ message: 'Please provide a date' })
  date: Date;

  constructor(partial: Partial<SessionsForDayDto>) {
    Object.assign(this, partial);
  }
}

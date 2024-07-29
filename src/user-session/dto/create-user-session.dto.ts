import { IsDefined, IsPositive } from 'class-validator';

export class CreateUserSessionDto {
  @IsDefined({ message: 'Please provide a session ID' })
  @IsPositive({ message: 'Session ID must be a positive number' })
  sessionId: number;

  constructor(partial: Partial<CreateUserSessionDto>) {
    Object.assign(this, partial);
  }
}

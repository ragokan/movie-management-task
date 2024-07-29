import { ApiProperty } from '@nestjs/swagger';
import { AgeRestriction } from '@prisma/client';
import { IsDefined, IsEnum } from 'class-validator';

export class CreateMovieDto {
  @IsDefined({ message: 'Please provide a name' })
  name: string;

  @ApiProperty({
    enum: AgeRestriction,
    examples: Object.values(AgeRestriction),
  })
  @IsDefined({ message: 'Please provide an age restriction' })
  @IsEnum(AgeRestriction, { message: 'Invalid age restriction' })
  ageRestriction: AgeRestriction;

  constructor(partial: Partial<CreateMovieDto>) {
    Object.assign(this, partial);
  }
}

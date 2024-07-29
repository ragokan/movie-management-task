import { ApiProperty } from '@nestjs/swagger';
import { AgeRestriction } from '@prisma/client';

export class MovieEntity {
  id: number;
  name: string;

  @ApiProperty({
    enum: AgeRestriction,
    examples: Object.values(AgeRestriction),
  })
  ageRestriction: AgeRestriction;
}

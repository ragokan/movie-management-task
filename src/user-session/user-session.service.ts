import { HttpException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '@src/common/database.service';
import { CreateUserSessionDto } from './dto/create-user-session.dto';

@Injectable()
export class UserSessionService {
  constructor(private readonly dbService: DatabaseService) {}

  private readonly getSelectOptions = {
    id: true,
    userId: true,
    session: {
      select: {
        id: true,
        date: true,
        durationInMinutes: true,
        roomNumber: true,
        movie: { select: { id: true, name: true, ageRestriction: true } },
      },
    },
  } satisfies Prisma.UserSessionDefaultArgs['select'];

  async create(
    createUserSessionDto: CreateUserSessionDto,
    userId: number,
    userAge: number,
  ) {
    // check for user age
    const { movie } = await this.dbService.session.findUnique({
      where: { id: createUserSessionDto.sessionId },
      select: { movie: { select: { ageRestriction: true } } },
    });
    const { ageRestriction } = movie;
    if (ageRestriction === 'GT18' && userAge < 18) {
      throw new HttpException(
        'User is not old enough to watch this movie',
        400,
      );
    } else if (ageRestriction === 'GT12' && userAge < 12) {
      throw new HttpException(
        'User is not old enough to watch this movie',
        400,
      );
    } else if (ageRestriction === 'GT6' && userAge < 6) {
      throw new HttpException(
        'User is not old enough to watch this movie',
        400,
      );
    }

    return this.dbService.userSession.create({
      data: {
        ...createUserSessionDto,
        userId,
      },
      select: this.getSelectOptions,
    });
  }

  findAll(userId: number) {
    return this.dbService.userSession.findMany({
      where: { userId },
      select: this.getSelectOptions,
    });
  }

  async remove(id: number, userId: number) {
    try {
      await this.dbService.userSession.delete({
        where: {
          id,
          userId,
        },
      });
    } catch (error) {
      throw new Error(`User session with ID ${id} not found`);
    }
  }
}

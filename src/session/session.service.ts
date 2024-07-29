import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Session } from '@prisma/client';
import { DatabaseService } from '@src/common/database.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionService {
  constructor(private readonly dbService: DatabaseService) {}

  private includeAndOmitOptions = {
    include: { movie: true },
    omit: { movieId: true },
  } satisfies Pick<Prisma.SessionFindManyArgs, 'include' | 'omit'>;

  async create(createSessionDto: CreateSessionDto) {
    // Check if there is any other session at given date + durationInMinutes and roomNumber
    const existingSession = await this.dbService.session.findFirst({
      where: {
        OR: [
          {
            date: {
              gte: createSessionDto.date,
              lt: new Date(
                createSessionDto.date.getTime() +
                  createSessionDto.durationInMinutes * 60000 +
                  600, // +10 minutes break
              ),
            },
          },
          {
            date: {
              lt: createSessionDto.date,
              gte: new Date(
                createSessionDto.date.getTime() -
                  createSessionDto.durationInMinutes * 60000,
              ),
            },
          },
        ],
        roomNumber: createSessionDto.roomNumber,
      },
    });

    if (existingSession) {
      throw new Error('Session already exists at this time and room');
    }

    const session = await this.dbService.session.create({
      data: createSessionDto,
      ...this.includeAndOmitOptions,
    });
    return session;
  }

  async findAll(sortByField?: keyof Session) {
    const sessions = await this.dbService.session.findMany({
      ...this.includeAndOmitOptions,
      orderBy: sortByField ? { [sortByField]: 'asc' } : undefined,
    });
    return sessions;
  }

  async findAllForTheDay(currentDate: Date, sortByField?: keyof Session) {
    const sessions = await this.dbService.session.findMany({
      where: {
        date: {
          gt: new Date(currentDate.setHours(0, 0, 0, 0)),
          lt: new Date(currentDate.setHours(23, 59, 59, 999)),
        },
      },
      ...this.includeAndOmitOptions,
      orderBy: sortByField ? { [sortByField]: 'asc' } : undefined,
    });
    return sessions;
  }

  async findOne(id: number) {
    try {
      const session = await this.dbService.session.findUniqueOrThrow({
        where: { id },
        include: {
          movie: true,
        },
        omit: {
          movieId: true,
        },
      });
      return session;
    } catch (error) {
      throw new NotFoundException('Session is not found');
    }
  }

  async update(id: number, updateSessionDto: UpdateSessionDto) {
    try {
      const session = await this.dbService.session.update({
        where: { id },
        data: updateSessionDto,
        ...this.includeAndOmitOptions,
      });
      return session;
    } catch (error) {
      throw new NotFoundException('Session is not found');
    }
  }

  async remove(id: number) {
    try {
      await this.dbService.session.delete({
        where: { id },
      });
      return { success: true };
    } catch (error) {
      throw new NotFoundException('Session is not found');
    }
  }
}

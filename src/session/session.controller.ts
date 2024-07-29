import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Session } from '@prisma/client';
import { UseAuth } from '@src/auth/security/use-auth.decorator';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionsForDayDto } from './dto/sessions-for-day.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionEntity } from './entities/session.entity';
import { SessionService } from './session.service';

@ApiTags('session')
@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  /*
   * Create a new session.
   * Only managers can create session.
   */
  @Post()
  @UseAuth('MANAGER')
  create(@Body() createSessionDto: CreateSessionDto): Promise<SessionEntity> {
    return this.sessionService.create(createSessionDto);
  }

  /*
   * Get all sessions.
   */
  @Get()
  findAll(
    @Query('sortByField') sortByField?: keyof Session,
  ): Promise<SessionEntity[]> {
    return this.sessionService.findAll(sortByField);
  }

  /*
   * Get all sessions for the given date.
   */
  @Get()
  findAllForTheDay(
    @Body() body: SessionsForDayDto,
    @Query('sortByField') sortByField?: keyof Session,
  ): Promise<SessionEntity[]> {
    return this.sessionService.findAllForTheDay(body.date, sortByField);
  }

  /*
   * Get a session by ID.
   * @param id - The ID of the session.
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<SessionEntity> {
    return this.sessionService.findOne(id);
  }

  /*
   * Update a session by ID.
   * @param id - The ID of the session.
   * @param updateSessionDto - The updated session data.
   */
  @Patch(':id')
  @UseAuth('MANAGER')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSessionDto: UpdateSessionDto,
  ): Promise<SessionEntity> {
    return this.sessionService.update(id, updateSessionDto);
  }

  /*
   * Delete a session by ID.
   * @param id - The ID of the session.
   */
  @Delete(':id')
  @UseAuth('MANAGER')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sessionService.remove(id);
  }
}

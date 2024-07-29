import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UseAuth } from '@src/auth/security/use-auth.decorator';
import { RequestUser, User } from '@src/common/user.decorator';
import { CreateUserSessionDto } from './dto/create-user-session.dto';
import { UserSessionEntity } from './entities/user-session.entity';
import { UserSessionService } from './user-session.service';

@ApiTags('user-session')
@Controller('user-session')
export class UserSessionController {
  constructor(private readonly userSessionService: UserSessionService) {}

  /*
   * Create a new user session.
   */
  @Post()
  @UseAuth()
  create(
    @Body() createUserSessionDto: CreateUserSessionDto,
    @User() user: RequestUser,
  ): Promise<UserSessionEntity> {
    return this.userSessionService.create(
      createUserSessionDto,
      user.id,
      user.age,
    );
  }

  /*
   * Get all user sessions.
   */
  @Get()
  @UseAuth()
  findAll(@User() user: RequestUser): Promise<UserSessionEntity[]> {
    return this.userSessionService.findAll(user.id);
  }

  /*
   * Delete a user session by ID.
   * @param id - The ID of the user session.
   */
  @Delete(':id')
  @UseAuth()
  remove(@Param('id', ParseIntPipe) id: number, @User() user: RequestUser) {
    return this.userSessionService.remove(id, user.id);
  }
}

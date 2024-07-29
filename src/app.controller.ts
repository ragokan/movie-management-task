import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { GetServerStatusDto } from './entities/get-server-status.dto';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getServerStatus(): GetServerStatusDto {
    return this.appService.getServerStatus();
  }
}

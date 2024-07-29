import { Injectable } from '@nestjs/common';
import { GetServerStatusDto } from './entities/get-server-status.dto';

@Injectable()
export class AppService {
  getServerStatus() {
    return new GetServerStatusDto({
      status: 'Movie Management API is running',
      version: '1.0.0',
    });
  }
}

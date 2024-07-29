import { PartialType } from '@nestjs/swagger';
import { CreateUserSessionDto } from './create-user-session.dto';

export class CancelUserSessionDto extends PartialType(CreateUserSessionDto) {
  constructor(partial: Partial<CancelUserSessionDto>) {
    super();
    Object.assign(this, partial);
  }
}

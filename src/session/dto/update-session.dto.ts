import { PartialType } from '@nestjs/swagger';
import { CreateSessionDto } from './create-session.dto';

export class UpdateSessionDto extends PartialType(CreateSessionDto) {
  constructor(partial: Partial<CreateSessionDto>) {
    super();
    Object.assign(this, partial);
  }
}

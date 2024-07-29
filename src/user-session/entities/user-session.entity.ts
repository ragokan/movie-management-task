import { SessionEntity } from '@src/session/entities/session.entity';

export class UserSessionEntity {
  id: number;

  session: SessionEntity;
  userId: number;
}

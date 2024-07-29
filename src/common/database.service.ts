import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const isTest = process.env.NODE_ENV === 'test';

    const datasourceUrl = isTest
      ? process.env.TEST_DATABASE_URL
      : process.env.DATABASE_URL;

    if (isTest) {
      try {
        execSync(
          `DATABASE_URL=${datasourceUrl} npx prisma db push --force-reset --skip-generate`,
        );
      } catch (_) {}
    }

    super({ datasourceUrl });
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }

  async onModuleInit() {
    await this.$connect();

    if (process.env.NODE_ENV === 'test') {
      console.log('Resetting test database on init');
      await this.$transaction([
        this.user.deleteMany(),
        this.movie.deleteMany(),
      ]);
    }
  }
}

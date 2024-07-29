import { ConsoleLogger } from '@nestjs/common';

export class CustomLogger extends ConsoleLogger {
  // Don't log basic information
  log(): void {}
}

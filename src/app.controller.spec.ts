import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get(AppController);
    appService = app.get(AppService);
  });

  describe('root', () => {
    it('should return server status', () => {
      expect(appController.getServerStatus()).toEqual(
        appService.getServerStatus(),
      );
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { BaseModuleImports } from '@src/app.module';
import { Response } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';

describe('AuthController', () => {
  let controller: AuthController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: BaseModuleImports,
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  const testUser = new RegisterUserDto({
    username: 'test',
    password: 'test',
    age: 20,
  });

  const mockResponse = {
    setHeader: jest.fn(),
  } as any as Response;

  describe('register', () => {
    it('should register', async () => {
      const registerResult = await controller.register(testUser, mockResponse);
      expect(registerResult).toHaveProperty('access_token');
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Authorization',
        `Bearer ${registerResult.access_token}`,
      );
    });
  });

  describe('login', () => {
    it('should login', async () => {
      const loginResult = await controller.login(
        {
          username: testUser.username,
          password: testUser.password,
        },
        mockResponse,
      );
      expect(loginResult).toHaveProperty('access_token');
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Authorization',
        `Bearer ${loginResult.access_token}`,
      );
    });
  });

  describe('refreshToken', () => {
    it('should refresh token', async () => {
      const loginResult = await controller.login(
        { username: testUser.username, password: testUser.password },
        mockResponse,
      );
      expect(loginResult).toHaveProperty('access_token');
      const access_token = loginResult.access_token;

      const refreshResult = controller.refreshToken(
        `Bearer ${access_token}`,
        mockResponse,
      );
      expect(refreshResult).toHaveProperty('access_token');
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Authorization',
        `Bearer ${refreshResult.access_token}`,
      );
    });
  });
});

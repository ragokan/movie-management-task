import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

export const BearerToken = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    try {
      const request = ctx.switchToHttp().getRequest<Request>();
      return request.headers.authorization;
    } catch (error) {
      throw new UnauthorizedException();
    }
  },
);

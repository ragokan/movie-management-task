import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { Observable } from 'rxjs';
import { AUTH_ROLES_KEY } from './use-auth.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(AUTH_ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (roles.length === 0) {
      return true;
    }

    const user = context.switchToHttp().getRequest().user;
    if (!roles.includes(user.role)) {
      throw new HttpException('Forbidden', 403);
    }

    return true;
  }
}

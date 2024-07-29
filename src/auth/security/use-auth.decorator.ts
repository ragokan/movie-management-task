import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';

// Exclude 'CUSTOMER' because CUSTOMER can access to anything.
export function UseAuth(...roles: Exclude<UserRole, 'CUSTOMER'>[]) {
  return applyDecorators(
    SetMetadata(AUTH_ROLES_KEY, roles),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized', status: 401 }),
  );
}

export const AUTH_ROLES_KEY = 'roles';

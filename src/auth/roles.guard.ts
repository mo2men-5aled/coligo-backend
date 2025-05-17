import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

interface AuthenticatedRequest extends Request {
  user: {
    role: string;
    [key: string]: any;
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    // If no roles are required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    // Check if user exists and has a role
    if (!user?.role) {
      throw new ForbiddenException('User role not found');
    }

    // Check if user has at least one of the required roles
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied - insufficient permissions');
    }

    return true;
  }
}

import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtGuard extends AuthGuard(['jwt']) {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as Request;
    if (request.user) return true;
    return super.canActivate(context);
  }
}

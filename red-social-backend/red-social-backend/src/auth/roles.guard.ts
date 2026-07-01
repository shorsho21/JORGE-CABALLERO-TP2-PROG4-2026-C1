import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // req.user lo inyecta el JwtAuthGuard antes que este guard
    // Por eso siempre usamos ambos juntos: @UseGuards(JwtAuthGuard, RolesGuard)
    const user = request.user;

    if (!user || user.perfil !== 'administrador') {
      // 403 Forbidden — el usuario está logueado pero no tiene permisos de admin
      throw new ForbiddenException('Solo los administradores pueden realizar esta acción');
    }

    return true;
  }
}
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
//protege los endpoints que requieren autenticacion si el token es invalido
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
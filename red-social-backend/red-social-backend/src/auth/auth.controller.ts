// src/auth/auth.controller.ts ← ya existe, reemplazás el contenido

import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ── POST /auth/login ──────────────────────────────────────────────────────
  // Endpoint público — no requiere token
  // Recibe email (o username) y password, devuelve token + datos del usuario
  @Post('login')
  login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.login(email, password);
  }

  // ── POST /auth/autorizar ──────────────────────────────────────────────────
  // Requiere token JWT válido en el header: Authorization: Bearer <token>
  // El JwtAuthGuard valida el token ANTES de ejecutar el método
  // Si el token es inválido o expiró → el guard devuelve 401 automáticamente
  // Si es válido → req.user contiene los datos del payload (seteados por JwtStrategy)
  @Post('autorizar')
  @UseGuards(JwtAuthGuard)
  autorizar(@Request() req: any) {
    // Le pasamos los datos del usuario que vienen del token al servicio
    // para que busque el usuario fresco en la base de datos
    return this.authService.autorizar(req.user);
  }

  // ── POST /auth/refrescar ──────────────────────────────────────────────────
  // Requiere token JWT válido — si expiró, el guard devuelve 401
  // Si es válido → genera un token nuevo con los mismos datos y 15 min más
  // El frontend debe llamar a este endpoint antes de que el token expire
  // (en nuestro caso, a los 10 minutos — cuando quedan 5 minutos)
  @Post('refrescar')
  @UseGuards(JwtAuthGuard)
  refrescar(@Request() req: any) {
    return this.authService.refrescar(req.user);
  }
}
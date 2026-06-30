// src/auth/auth.service.ts ← ya existe, reemplazás el contenido

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  // Valida email/username y password, devuelve token + datos del usuario
  async login(email: string, password: string) {
    // Buscamos por email o username para que el usuario pueda usar cualquiera de los dos
    const user = await this.userModel.findOne({
      $or: [{ email }, { username: email }],
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Comparamos la password ingresada contra el hash guardado en la base de datos
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    // Generamos el token con el payload actualizado
    // Este payload es lo que va a estar disponible en req.user en los controllers
    const token = this.generarToken(user);

    // Devolvemos el usuario sin la password por seguridad
    const { password: _, ...userWithoutPassword } = user.toObject();

    return {
      message: 'Login exitoso',
      token,
      user: userWithoutPassword,
    };
  }

  // ── AUTORIZAR ─────────────────────────────────────────────────────────────
  // Valida que el token sea correcto y devuelve los datos del usuario
  // Este método lo llama el controller después de que el JwtAuthGuard ya validó el token
  // Si el token es inválido, el guard tira 401 antes de llegar acá
  async autorizar(userFromToken: any) {
    // userFromToken viene del JwtStrategy.validate() — ya tiene los datos del payload
    // Buscamos el usuario en la base de datos para devolver datos frescos
    const user = await this.userModel.findById(userFromToken.userId).select('-password');

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return {
      message: 'Token válido',
      user,
    };
  }

  // ── REFRESCAR ─────────────────────────────────────────────────────────────
  // Recibe un token válido y devuelve uno nuevo con el mismo payload y 15 min más
  // El guard ya validó que el token sea correcto antes de llegar acá
  async refrescar(userFromToken: any) {
    // Buscamos el usuario para tener los datos actualizados en el nuevo token
    const user = await this.userModel.findById(userFromToken.userId);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Generamos un token nuevo con los mismos datos — el vencimiento se renueva automáticamente
    const token = this.generarToken(user);

    return {
      message: 'Token renovado',
      token,
    };
  }

  // ── HELPER PRIVADO ────────────────────────────────────────────────────────
  // Centraliza la generación del token para no repetir el payload en cada método
  // Si en el futuro hay que agregar algo al payload, se cambia en un solo lugar
  private generarToken(user: any): string {
    const payload = {
      sub: user._id,           // id único del usuario (estándar JWT usar "sub" para esto)
      email: user.email,
      username: user.username,  // 👈 agregamos username al payload
      perfil: user.perfil,      // rol: 'usuario' o 'administrador'
    };

    return this.jwtService.sign(payload);
  }
}
import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
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
  async login(email: string, password: string) {
    const user = await this.userModel.findOne({
      $or: [{ email }, { username: email }],
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Verificamos si el usuario está habilitado ANTES de chequear la contraseña
    // Así el mensaje es específico: sabe que su cuenta fue deshabilitada
    // y no confunde con credenciales incorrectas
    if (!user.habilitado) {
      throw new ForbiddenException(
        'Tu cuenta ha sido deshabilitada. Contactá al administrador.',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const token = this.generarToken(user);
    const { password: _, ...userWithoutPassword } = user.toObject();

    return {
      message: 'Login exitoso',
      token,
      user: userWithoutPassword,
    };
  }

  // ── AUTORIZAR ─────────────────────────────────────────────────────────────
  async autorizar(userFromToken: any) {
    const user = await this.userModel
      .findById(userFromToken.userId)
      .select('-password');

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return {
      message: 'Token válido',
      user,
    };
  }

  // ── REFRESCAR ─────────────────────────────────────────────────────────────
  async refrescar(userFromToken: any) {
    const user = await this.userModel.findById(userFromToken.userId);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const token = this.generarToken(user);

    return {
      message: 'Token renovado',
      token,
    };
  }

  // ── HELPER PRIVADO ────────────────────────────────────────────────────────
  private generarToken(user: any): string {
    const payload = {
      sub: user._id,
      email: user.email,
      username: user.username,
      perfil: user.perfil,
    };

    return this.jwtService.sign(payload);
  }
}
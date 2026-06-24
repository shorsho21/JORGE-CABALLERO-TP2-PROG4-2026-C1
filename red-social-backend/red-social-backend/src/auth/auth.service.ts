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

  async login(email: string, password: string) {
    // 🔍 buscar usuario por email o username
    const user = await this.userModel.findOne({
      $or: [{ email }, { username: email }],
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // 🔐 comparar password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    // 🎟️ generar token
    const payload = {
      sub: user._id,
      email: user.email,
      perfil: user.perfil,
    };

    const token = this.jwtService.sign(payload);

    // 🚀 devolver usuario sin password + token
    const { password: _, ...userWithoutPassword } = user.toObject();

    return {
      message: 'Login exitoso',
      token,
      user: userWithoutPassword,
    };
  }
  
}
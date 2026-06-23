import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async login(email: string, password: string) {
    // 🔍 buscar usuario
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // 🔐 comparar password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    // 🚀 devolver usuario (sin password)
    const { password: _, ...userWithoutPassword } = user.toObject();

    return {
      message: 'Login exitoso',
      user: userWithoutPassword,
    };
  }
}

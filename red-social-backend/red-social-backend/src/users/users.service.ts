import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,

    @Inject('CLOUDINARY')
    private cloudinary: any,
  ) {}

  // ── CREAR USUARIO ─────────────────────────────────────────────────────────
  // Lo usa tanto el registro público como el dashboard de admin
  // El campo perfil viene en el DTO y puede ser 'usuario' o 'administrador'
  async create(createUserDto: CreateUserDto, file: Express.Multer.File) {
    let imageUrl = '';

    // Validamos que no exista otro usuario con el mismo email o username
    const existingUser = await this.userModel.findOne({
      $or: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });

    if (existingUser) {
      throw new ConflictException(
        'Ya existe un usuario con ese email o username',
      );
    }

    // Si viene una imagen la subimos a Cloudinary
    if (file) {
      const result = await this.cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
        { folder: 'red-social' },
      );
      imageUrl = result.secure_url;
    }

    // Hasheamos la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      imagenPerfil: imageUrl,
    });

    return newUser.save();
  }

  // ── LISTAR USUARIOS ───────────────────────────────────────────────────────
  // Excluimos la password de la respuesta por seguridad
  async findAll() {
    return this.userModel.find({}, { password: 0 });
  }

  // ── ACTUALIZAR ROL ────────────────────────────────────────────────────────
  async updateRol(id: string, perfil: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    user.perfil = perfil;
    return user.save();
  }

  // ── DESHABILITAR USUARIO ──────────────────────────────────────────────────
  // Baja lógica: el usuario sigue existiendo en la DB pero no puede ingresar
  // El login lo detecta y devuelve 403 con mensaje específico
  async deshabilitar(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    user.habilitado = false;
    return user.save();
  }

  // ── REHABILITAR USUARIO ───────────────────────────────────────────────────
  // Alta lógica: vuelve a habilitar un usuario previamente deshabilitado
  async rehabilitar(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    user.habilitado = true;
    return user.save();
  }
}
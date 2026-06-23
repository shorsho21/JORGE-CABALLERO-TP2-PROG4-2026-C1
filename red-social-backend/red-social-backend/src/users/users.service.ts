import { Injectable, Inject, ConflictException } from '@nestjs/common';
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

    // Cloudinary provider
    @Inject('CLOUDINARY')
    private cloudinary: any,
  ) {}

  async create(createUserDto: CreateUserDto, file: Express.Multer.File) {
    let imageUrl = '';

    //  VALIDAR DUPLICADOS
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

    // 📸 SUBIR IMAGEN
    //si el archivo existe, lo sube a cloudinary y obtiene la URL de la imagen
    if (file) {
      const result = await this.cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
        {
          folder: 'red-social',
        },
      );

      imageUrl = result.secure_url;
    }

    //  HASH PASSWORD, hace un hash de la contrase;a usando bcrypt
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    //  CREAR USUARIO, usa el schema de mongoose para crear un nuevo usuario con los datos del DTO
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      imagenPerfil: imageUrl,
    });

    return newUser.save();
  }
}

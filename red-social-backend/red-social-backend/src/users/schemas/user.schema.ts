import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  nombre!: string;

  @Prop({ required: true })
  apellido!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true, unique: true })
  username!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: true })
  fechaNacimiento!: Date;

  @Prop()
  descripcion!: string;

  @Prop()
  imagenPerfil!: string;

  @Prop({
    default: 'usuario',
    enum: ['usuario', 'administrador'],
  })
  perfil!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

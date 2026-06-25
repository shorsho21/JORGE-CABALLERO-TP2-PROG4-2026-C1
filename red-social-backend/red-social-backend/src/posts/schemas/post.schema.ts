import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
//timestamps, agrega created at y update at automaticamente
@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ default: '' })
  imagenUrl: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  autor: Types.ObjectId;
  //array de ids de usuarios que le dieron like a la publicacion, para contar y evitar repetidos
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  likes: Types.ObjectId[];

  @Prop({ default: false })
  eliminado: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);

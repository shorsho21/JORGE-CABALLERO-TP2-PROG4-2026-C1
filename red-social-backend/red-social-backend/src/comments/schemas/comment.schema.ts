import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// timestamps: true agrega automáticamente createdAt y updatedAt a cada documento
@Schema({ timestamps: true })
export class Comment extends Document {
  // ID de la publicación a la que pertenece este comentario
  @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
  publicacionId!: Types.ObjectId;

  // ID del usuario que escribió el comentario
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  autorId!: Types.ObjectId;

  // Texto del comentario
  @Prop({ required: true })
  mensaje!: string;

  // Indica si el comentario fue editado después de crearse
  // Por defecto es false; se cambia a true cuando el usuario edita
  @Prop({ default: false })
  modificado!: boolean;
}

// Esto convierte la clase en un schema real de Mongoose que Mongo puede usar
export const CommentSchema = SchemaFactory.createForClass(Comment);


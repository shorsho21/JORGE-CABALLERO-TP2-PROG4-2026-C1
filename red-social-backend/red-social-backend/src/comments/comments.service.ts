import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    // Inyectamos el modelo de Mongoose para poder hacer operaciones en la colección "comments"
    @InjectModel(Comment.name)
    private commentModel: Model<Comment>,
  ) {}

  // ── CREAR COMENTARIO ──────────────────────────────────────────────────────
  // Recibe el id de la publicación, el id del usuario logueado y el DTO con el mensaje
  async create(publicacionId: string, autorId: string, dto: CreateCommentDto) {
    const nuevoComentario = new this.commentModel({
      publicacionId: new Types.ObjectId(publicacionId),
      autorId: new Types.ObjectId(autorId),
      mensaje: dto.mensaje,
    });

    await nuevoComentario.save();

    // Hacemos populate después de guardar para devolver el autor completo
    // así el frontend no necesita pedir nada extra ni usa una imagen random de fallback
    return this.commentModel
      .findById(nuevoComentario._id)
      .populate('autorId', 'nombre apellido username imagenPerfil')
      .exec();
  }

  // ── EDITAR COMENTARIO ─────────────────────────────────────────────────────
  // Solo el autor del comentario puede editarlo
  async update(comentarioId: string, autorId: string, dto: UpdateCommentDto) {
    const comentario = await this.commentModel.findById(comentarioId);

    if (!comentario) {
      throw new NotFoundException('Comentario no encontrado');
    }

    if (comentario.autorId.toString() !== autorId) {
      throw new ForbiddenException('No podés editar un comentario ajeno');
    }

    comentario.mensaje = dto.mensaje;
    comentario.modificado = true;
    await comentario.save();

    // Igual que en create, populamos antes de devolver
    return this.commentModel
      .findById(comentario._id)
      .populate('autorId', 'nombre apellido username imagenPerfil')
      .exec();
  }

  // ── LISTAR COMENTARIOS DE UNA PUBLICACIÓN ────────────────────────────────
  // Devuelve los comentarios paginados, ordenados del más reciente al más antiguo
  // offset: desde qué comentario empezar (para paginación)
  // limit: cuántos traer por vez (por defecto 10)
  async findByPost(publicacionId: string, offset = 0, limit = 10) {
    return (
      this.commentModel
        .find({
          // Filtramos por publicación
          publicacionId: new Types.ObjectId(publicacionId),
        })
        // Ordenamos por fecha de creación descendente (más nuevo primero)
        .sort({ createdAt: -1 })
        // Saltamos los primeros "offset" resultados (para el botón "cargar más")
        .skip(offset)
        // Traemos solo "limit" resultados
        .limit(limit)
        // Populate trae los datos del usuario autor en lugar de solo el id
        .populate('autorId', 'nombre apellido username imagenPerfil')
        .exec()
    );
  }
}

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private postModel: Model<Post>,
    @Inject('CLOUDINARY')
    private cloudinary: any,
  ) {}

  // 📝 CREAR PUBLICACIÓN
  async create(createPostDto: CreatePostDto, autorId: string, file: any) {
    let imageUrl = '';
    //si existe un archivo lo subo a cloudinary y obtengo la url
    if (file) {
      const result = await this.cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
        { folder: 'red-social/posts' },
      );
      imageUrl = result.secure_url;
    }

    const newPost = new this.postModel({
      ...createPostDto,
      autor: new Types.ObjectId(autorId),
      imagenUrl: imageUrl,
    });

    return newPost.save();
  }

  // 📋 LISTAR PUBLICACIONES
  async findAll(
    offset = 0,
    limit = 10,
    orderBy: 'fecha' | 'likes' = 'fecha',
    autorId?: string,
  ) {
    const filter: any = { eliminado: false };

    if (autorId) {
      filter.autor = new Types.ObjectId(autorId);
    }

    const sortOption: Record<string, 1 | -1> =
      orderBy === 'likes' ? { likesCount: -1 } : { createdAt: -1 };

    return this.postModel
      .aggregate([
        { $match: filter },
        { $addFields: { likesCount: { $size: '$likes' } } },
        { $sort: sortOption },
        { $skip: offset },
        { $limit: limit },
        {
          $lookup: {
            from: 'users',
            localField: 'autor',
            foreignField: '_id',
            as: 'autor',
          },
        },
        { $unwind: '$autor' },
        {
          $project: {
            'autor.password': 0,
          },
        },
      ])
      .exec();
  }

  // ❌ BAJA LÓGICA
  async remove(postId: string, userId: string, perfil: string) {
    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Publicación no encontrada');
    }

    const esAutor = post.autor.toString() === userId;
    const esAdmin = perfil === 'administrador';

    if (!esAutor && !esAdmin) {
      throw new ForbiddenException(
        'No tenés permiso para eliminar esta publicación',
      );
    }

    post.eliminado = true;
    return post.save();
  }

  // ❤️ DAR LIKE
  async addLike(postId: string, userId: string) {
    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Publicación no encontrada');
    }

    const yaLiked = post.likes.some((id) => id.toString() === userId);

    if (yaLiked) {
      throw new BadRequestException('Ya le diste me gusta a esta publicación');
    }

    post.likes.push(new Types.ObjectId(userId));
    return post.save();
  }

  // 💔 QUITAR LIKE
  async removeLike(postId: string, userId: string) {
    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Publicación no encontrada');
    }

    const yaLiked = post.likes.some((id) => id.toString() === userId);

    if (!yaLiked) {
      throw new BadRequestException(
        'No le habías dado me gusta a esta publicación',
      );
    }

    post.likes = post.likes.filter((id) => id.toString() !== userId) as any;
    return post.save();
  }

  // src/posts/posts.service.ts ← agregás este método dentro de la clase PostsService

  // 🔍 TRAER PUBLICACIÓN POR ID
  async findOne(postId: string) {
    const posts = await this.postModel
      .aggregate([
        // Filtramos por id y que no esté eliminada
        { $match: { _id: new Types.ObjectId(postId), eliminado: false } },
        // Hacemos populate manual con aggregate para traer los datos del autor
        {
          $lookup: {
            from: 'users',
            localField: 'autor',
            foreignField: '_id',
            as: 'autor',
          },
        },
        { $unwind: '$autor' },
        // Excluimos la password del autor por seguridad
        { $project: { 'autor.password': 0 } },
      ])
      .exec();

    if (!posts.length) {
      throw new NotFoundException('Publicación no encontrada');
    }

    // aggregate siempre devuelve un array — tomamos el primer elemento
    return posts[0];
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../posts/schemas/post.schema';
import { Comment } from '../comments/schemas/comment.schema';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Post.name)
    private postModel: Model<Post>,

    @InjectModel(Comment.name)
    private commentModel: Model<Comment>,
  ) {}

  // ── PUBLICACIONES POR USUARIO ─────────────────────────────────────────────
  // Agrupa las publicaciones por autor y cuenta cuántas hizo cada uno
  // Solo cuenta publicaciones no eliminadas dentro del rango de fechas
  async publicacionesPorUsuario(desde: string, hasta: string) {
    const fechaDesde = new Date(desde);
    const fechaHasta = new Date(hasta);

    // Ajustamos hasta para incluir todo el día final (hasta las 23:59:59)
    fechaHasta.setHours(23, 59, 59, 999);

    return this.postModel.aggregate([
      // Etapa 1: filtrar por rango de fechas y que no estén eliminadas
      {
        $match: {
          createdAt: { $gte: fechaDesde, $lte: fechaHasta },
          eliminado: false,
        },
      },
      // Etapa 2: hacer join con la colección de usuarios para obtener el username
      {
        $lookup: {
          from: 'users',
          localField: 'autor',
          foreignField: '_id',
          as: 'autorData',
        },
      },
      // $lookup devuelve un array, $unwind lo convierte en un objeto
      { $unwind: '$autorData' },
      // Etapa 3: agrupar por autor y contar sus publicaciones
      {
        $group: {
          _id: '$autorData._id',
          username: { $first: '$autorData.username' },
          total: { $sum: 1 },
        },
      },
      // Etapa 4: ordenar de mayor a menor para el gráfico
      { $sort: { total: -1 } },
    ]);
  }

  // ── COMENTARIOS POR TIEMPO ────────────────────────────────────────────────
  // Agrupa los comentarios por día y cuenta cuántos hubo cada día
  // Devuelve una serie temporal para el gráfico de líneas
  async comentariosPorTiempo(desde: string, hasta: string) {
    const fechaDesde = new Date(desde);
    const fechaHasta = new Date(hasta);
    fechaHasta.setHours(23, 59, 59, 999);

    return this.commentModel.aggregate([
      // Etapa 1: filtrar por rango de fechas
      {
        $match: {
          createdAt: { $gte: fechaDesde, $lte: fechaHasta },
        },
      },
      // Etapa 2: agrupar por día usando $dateToString
      // Esto convierte la fecha a string "YYYY-MM-DD" para agrupar por día
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          total: { $sum: 1 },
        },
      },
      // Etapa 3: renombrar _id a fecha para que el frontend lo lea más fácil
      {
        $project: {
          _id: 0,
          fecha: '$_id',
          total: 1,
        },
      },
      // Etapa 4: ordenar cronológicamente para que el gráfico tenga sentido
      { $sort: { fecha: 1 } },
    ]);
  }

  // ── COMENTARIOS POR PUBLICACIÓN ───────────────────────────────────────────
  // Cuenta cuántos comentarios tiene cada publicación en el rango de fechas
  // Devuelve el título de la publicación para la etiqueta del gráfico de torta
  async comentariosPorPublicacion(desde: string, hasta: string) {
    const fechaDesde = new Date(desde);
    const fechaHasta = new Date(hasta);
    fechaHasta.setHours(23, 59, 59, 999);

    return this.commentModel.aggregate([
      // Etapa 1: filtrar comentarios por rango de fechas
      {
        $match: {
          createdAt: { $gte: fechaDesde, $lte: fechaHasta },
        },
      },
      // Etapa 2: agrupar por publicación y contar comentarios
      {
        $group: {
          _id: '$publicacionId',
          total: { $sum: 1 },
        },
      },
      // Etapa 3: join con posts para obtener el título de cada publicación
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: '_id',
          as: 'postData',
        },
      },
      { $unwind: '$postData' },
      // Etapa 4: solo incluir publicaciones que no estén eliminadas
      {
        $match: { 'postData.eliminado': false },
      },
      // Etapa 5: dar forma final a la respuesta
      {
        $project: {
          _id: 0,
          publicacionId: '$_id',
          titulo: '$postData.titulo',
          total: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);
  }
}
import {
  Controller,
  Post,
  Put,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

// Todos los endpoints de comentarios viven bajo /posts/:postId/comentarios
// excepto el de editar, que vive bajo /comentarios/:id
@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // ── POST /posts/:postId/comentarios ───────────────────────────────────────
  // Agrega un comentario a una publicación específica
  // Requiere token JWT — solo usuarios logueados pueden comentar
  @Post('posts/:postId/comentarios')
  @UseGuards(JwtAuthGuard)
  create(
    @Param('postId') postId: string,       // id de la publicación desde la URL
    @Body() dto: CreateCommentDto,          // mensaje validado por el DTO
    @Request() req: any,                    // req.user viene del JwtStrategy después de validar el token
  ) {
    // req.user.userId lo setea el JwtStrategy en el método validate()
    return this.commentsService.create(postId, req.user.userId, dto);
  }

  // ── PUT /comentarios/:id ──────────────────────────────────────────────────
  // Edita el mensaje de un comentario propio
  // Requiere token JWT — el servicio verifica que sea el autor
  @Put('comentarios/:id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,               // id del comentario a editar
    @Body() dto: UpdateCommentDto,          // nuevo mensaje validado por el DTO
    @Request() req: any,
  ) {
    return this.commentsService.update(id, req.user.userId, dto);
  }

  // ── GET /posts/:postId/comentarios ────────────────────────────────────────
  // Trae los comentarios de una publicación, paginados
  // No requiere token — cualquiera puede leer comentarios
  @Get('posts/:postId/comentarios')
  findByPost(
    @Param('postId') postId: string,
    // Query params opcionales para paginación: /posts/123/comentarios?offset=0&limit=10
    @Query('offset') offset: string,
    @Query('limit') limit: string,
  ) {
    // parseInt convierte el string de la query a número
    // El || pone valores por defecto si no se envían los params
    return this.commentsService.findByPost(
      postId,
      parseInt(offset) || 0,
      parseInt(limit) || 10,
    );
  }
}
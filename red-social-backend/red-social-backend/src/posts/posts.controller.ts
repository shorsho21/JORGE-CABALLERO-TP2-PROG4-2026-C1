import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // 📝 CREAR PUBLICACIÓN
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Request() req: any,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: any,
  ) {
    return this.postsService.create(createPostDto, req.user.userId, file);
  }

  // 📋 LISTAR PUBLICACIONES
  @Get()
  findAll(
    @Query('offset') offset: string,
    @Query('limit') limit: string,
    @Query('orderBy') orderBy: 'fecha' | 'likes',
    @Query('autorId') autorId: string,
  ) {
    return this.postsService.findAll(
      parseInt(offset) || 0,
      parseInt(limit) || 10,
      orderBy || 'fecha',
      autorId,
    );
  }

  // ❌ BAJA LÓGICA
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id') postId: string,
    @Request() req: any,
  ) {
    return this.postsService.remove(postId, req.user.userId, req.user.perfil);
  }

  // ❤️ DAR LIKE
  @Post(':id/likes')
  @UseGuards(JwtAuthGuard)
  addLike(
    @Param('id') postId: string,
    @Request() req: any,
  ) {
    return this.postsService.addLike(postId, req.user.userId);
  }

  // 💔 QUITAR LIKE
  @Delete(':id/likes')
  @UseGuards(JwtAuthGuard)
  removeLike(
    @Param('id') postId: string,
    @Request() req: any,
  ) {
    return this.postsService.removeLike(postId, req.user.userId);
  }
}
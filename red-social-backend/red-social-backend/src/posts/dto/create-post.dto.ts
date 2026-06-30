import { IsString, IsOptional } from 'class-validator';

export class CreatePostDto {
  @IsString()
  titulo: string;

  @IsString()
  descripcion: string;
  //la publicacion puede o no tener imagen
  @IsOptional()
  @IsString()
  imagenUrl?: string;
}

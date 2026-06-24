import { IsString, IsOptional } from 'class-validator';

export class CreatePostDto {
  @IsString()
  titulo: string;

  @IsString()
  descripcion: string;

  @IsOptional()
  @IsString()
  imagenUrl?: string;
}

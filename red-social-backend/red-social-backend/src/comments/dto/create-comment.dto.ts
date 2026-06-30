import { IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  // El mensaje es obligatorio y debe tener al menos 1 caracter
  // MinLength(1) evita que se envíen comentarios vacíos o solo con espacios
  @IsString()
  @MinLength(1)
  mensaje!: string;
}

import { IsString, MinLength } from 'class-validator';

export class UpdateCommentDto {
  // Solo se puede editar el mensaje, nada más
  // El campo "modificado" lo maneja el servicio automáticamente
  @IsString()
  @MinLength(1)
  mensaje!: string;
}
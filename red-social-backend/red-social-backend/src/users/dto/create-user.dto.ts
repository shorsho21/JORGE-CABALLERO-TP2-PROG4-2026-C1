import {
  IsDateString,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  nombre!: string;

  @IsString()
  apellido!: string;

  @IsEmail()
  email!: string;

  @IsString()
  username!: string;

  @MinLength(6)
  password!: string;

  @IsDateString()
  fechaNacimiento!: Date;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  imagenPerfil?: string;

  @IsOptional()
  @IsIn(['usuario', 'administrador'])
  perfil?: string;
}

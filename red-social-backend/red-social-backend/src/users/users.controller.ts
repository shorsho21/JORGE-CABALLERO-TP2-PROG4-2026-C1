import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ── POST /users ───────────────────────────────────────────────────────────
  // Público — lo usa el registro y también el admin desde el dashboard
  // El perfil viene en el body (radio buttons en el formulario del admin)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.create(createUserDto, file);
  }

  // ── GET /users ────────────────────────────────────────────────────────────
  // Solo admin — devuelve todos los usuarios sin password
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll() {
    return this.usersService.findAll();
  }

  // ── PATCH /users/:id/rol ──────────────────────────────────────────────────
  // Solo admin — cambia el rol de un usuario entre 'usuario' y 'administrador'
  @Patch(':id/rol')
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateRol(
    @Param('id') id: string,
    @Body('perfil') perfil: string,
  ) {
    return this.usersService.updateRol(id, perfil);
  }

  // ── DELETE /users/:id ─────────────────────────────────────────────────────
  // Solo admin — baja lógica, pone habilitado en false
  // El usuario deshabilitado no puede hacer login y recibe un mensaje de aviso
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  deshabilitar(@Param('id') id: string) {
    return this.usersService.deshabilitar(id);
  }

  // ── POST /users/:id/rehabilitar ───────────────────────────────────────────
  // Solo admin — alta lógica, vuelve a poner habilitado en true
  // Usamos POST y no PATCH porque es una acción específica, no una edición de campo
  @Post(':id/rehabilitar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  rehabilitar(@Param('id') id: string) {
    return this.usersService.rehabilitar(id);
  }
}
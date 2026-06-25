import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // POST — crear usuario
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.create(createUserDto, file);
  }
  //nuevos enpoints para sprint 2, listar usuarios y actualizar rol, solo para admin
  // GET — listar todos los usuarios (solo admin para el panel admin)
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  // PATCH — actualizar rol (solo admin, par actualizar el rol del usuario en panel admin)
  @Patch(':id/rol')
  @UseGuards(JwtAuthGuard)
  updateRol(
    @Param('id') id: string,
    @Body('perfil') perfil: string,
  ) {
    return this.usersService.updateRol(id, perfil);
  }
}
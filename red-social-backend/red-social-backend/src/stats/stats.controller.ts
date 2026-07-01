import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { StatsService } from './stats.service';


// Todas las rutas de estadísticas requieren token + rol admin
// El prefijo 'stats' agrupa todos los endpoints de este módulo
@Controller('stats')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  // ── GET /stats/publicaciones-por-usuario ──────────────────────────────────
  // Devuelve cuántas publicaciones hizo cada usuario en un rango de fechas
  // Sirve para el gráfico de barras del dashboard
  @Get('publicaciones-por-usuario')
  publicacionesPorUsuario(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {
    return this.statsService.publicacionesPorUsuario(desde, hasta);
  }

  // ── GET /stats/comentarios-por-tiempo ─────────────────────────────────────
  // Devuelve cuántos comentarios se hicieron por día en un rango de fechas
  // Sirve para el gráfico de líneas del dashboard
  @Get('comentarios-por-tiempo')
  comentariosPorTiempo(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {
    return this.statsService.comentariosPorTiempo(desde, hasta);
  }

  // ── GET /stats/comentarios-por-publicacion ────────────────────────────────
  // Devuelve cuántos comentarios tiene cada publicación en un rango de fechas
  // Sirve para el gráfico de torta del dashboard
  @Get('comentarios-por-publicacion')
  comentariosPorPublicacion(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {
    return this.statsService.comentariosPorPublicacion(desde, hasta);
  }
}

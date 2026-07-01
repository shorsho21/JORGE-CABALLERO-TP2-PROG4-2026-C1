import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tiempoRelativo',
  standalone: true,
})
export class TiempoRelativoPipe implements PipeTransform {

  transform(fecha: string | Date): string {
    if (!fecha) return '';

    const ahora = new Date();
    const fechaDate = new Date(fecha);

    // Diferencia en segundos entre ahora y la fecha dada
    const segundos = Math.floor((ahora.getTime() - fechaDate.getTime()) / 1000);

    if (segundos < 60) return 'hace un momento';
    if (segundos < 3600) {
      const minutos = Math.floor(segundos / 60);
      return `hace ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
    }
    if (segundos < 86400) {
      const horas = Math.floor(segundos / 3600);
      return `hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
    }
    if (segundos < 2592000) {
      const dias = Math.floor(segundos / 86400);
      return `hace ${dias} ${dias === 1 ? 'día' : 'días'}`;
    }

    // Si pasó más de un mes, mostramos la fecha completa
    return fechaDate.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
}
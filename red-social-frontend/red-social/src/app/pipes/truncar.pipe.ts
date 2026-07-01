import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncar',
  standalone: true,
})
export class TruncarPipe implements PipeTransform {

  // limite: cantidad máxima de caracteres (por defecto 150)
  transform(texto: string, limite: number = 150): string {
    if (!texto) return '';

    // Si el texto entra completo, lo devolvemos sin cambios
    if (texto.length <= limite) return texto;

    // Cortamos en el último espacio antes del límite
    // para no cortar una palabra a la mitad
    const cortado = texto.substring(0, limite);
    const ultimoEspacio = cortado.lastIndexOf(' ');

    return cortado.substring(0, ultimoEspacio) + '...';
  }
}
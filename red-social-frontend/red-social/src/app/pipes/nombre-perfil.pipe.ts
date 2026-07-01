import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nombrePerfil',
  standalone: true,
})
export class NombrePerfilPipe implements PipeTransform {

  transform(perfil: string): string {
    if (!perfil) return '';

    const perfiles: Record<string, string> = {
      usuario: '👤 Usuario',
      administrador: '⭐ Administrador',
    };

    // Si el perfil no existe en el mapa, capitalizamos el string tal como viene
    return perfiles[perfil] ?? perfil.charAt(0).toUpperCase() + perfil.slice(1);
  }
}
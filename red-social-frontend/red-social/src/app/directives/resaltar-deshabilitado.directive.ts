import { Directive, Input, OnChanges, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appResaltarDeshabilitado]',
  standalone: true,
})
export class ResaltarDeshabilitadoDirective implements OnChanges {
  // Recibe el valor de habilitado desde el template
  @Input() appResaltarDeshabilitado = true;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  // Se ejecuta cada vez que cambia el valor de habilitado
  // Por ejemplo cuando el admin deshabilita o rehabilita un usuario
  ngOnChanges() {
    if (!this.appResaltarDeshabilitado) {
      // Usuario deshabilitado → borde rojo sutil y opacidad reducida
      this.renderer.setStyle(this.el.nativeElement, 'border-color', '#3a1a1a');
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '0.6');
    } else {
      // Usuario habilitado → estilos normales
      this.renderer.setStyle(this.el.nativeElement, 'border-color', '#2a2a2a');
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
    }
  }
}
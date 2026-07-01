import {
  Directive,
  Input,
  HostListener,
  ElementRef,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appClickCopiar]',
  standalone: true,
})
export class ClickCopiarDirective {
  // Texto a copiar al portapapeles
  @Input() appClickCopiar = '';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  @HostListener('click')
  async onClick() {
    if (!this.appClickCopiar) return;

    try {
      // Usamos la API moderna del navegador para copiar
      await navigator.clipboard.writeText(this.appClickCopiar);

      // Feedback visual: cambiamos el texto del elemento brevemente
      const textoOriginal = this.el.nativeElement.innerText;
      this.renderer.setProperty(this.el.nativeElement, 'innerText', '¡Copiado!');
      this.renderer.setStyle(this.el.nativeElement, 'color', '#34d399');

      // Volvemos al texto original después de 1.5 segundos
      setTimeout(() => {
        this.renderer.setProperty(
          this.el.nativeElement,
          'innerText',
          textoOriginal,
        );
        this.renderer.setStyle(this.el.nativeElement, 'color', '');
      }, 1500);
    } catch {
      console.error('No se pudo copiar al portapapeles');
    }
  }
}
import {
  Directive,
  Input,
  HostListener,
  ElementRef,
} from '@angular/core';

@Directive({
  selector: '[appClickCopiar]',
  standalone: true,
})
export class ClickCopiarDirective {
  @Input() appClickCopiar = '';

  private feedbackEl: HTMLElement | null = null;

  constructor(private el: ElementRef) {}

  @HostListener('click')
  async onClick() {
    if (!this.appClickCopiar) return;

    try {
      await navigator.clipboard.writeText(this.appClickCopiar);
      this.mostrarFeedback();
    } catch {
      console.error('No se pudo copiar al portapapeles');
    }
  }

  private mostrarFeedback() {
    // Si ya hay un feedback visible lo removemos antes de crear uno nuevo
    if (this.feedbackEl) {
      document.body.removeChild(this.feedbackEl);
      this.feedbackEl = null;
    }

    // Creamos el feedback en el body, no dentro del elemento
    this.feedbackEl = document.createElement('span');
    this.feedbackEl.innerText = '¡Copiado!';

    Object.assign(this.feedbackEl.style, {
      position: 'fixed',
      background: '#1a3a2a',
      color: '#34d399',
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '0.75rem',
      whiteSpace: 'nowrap',
      zIndex: '9999',
      pointerEvents: 'none',
    });

    document.body.appendChild(this.feedbackEl);

    // Lo posicionamos debajo del elemento
    const rect = this.el.nativeElement.getBoundingClientRect();
    this.feedbackEl.style.top = `${rect.bottom + 6}px`;
    this.feedbackEl.style.left = `${rect.left}px`;

    // Lo removemos después de 1.5 segundos
    setTimeout(() => {
      if (this.feedbackEl) {
        document.body.removeChild(this.feedbackEl);
        this.feedbackEl = null;
      }
    }, 1500);
  }
}
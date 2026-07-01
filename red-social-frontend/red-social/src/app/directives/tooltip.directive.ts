import {
  Directive,
  Input,
  HostListener,
  ElementRef,
} from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective {
  @Input() appTooltip = '';

  private tooltipEl: HTMLElement | null = null;

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    if (!this.appTooltip) return;

    // Creamos el tooltip y lo agregamos al body en lugar de al elemento host
    // Así no interfiere con el contenido del elemento ni con otras directivas
    this.tooltipEl = document.createElement('span');
    this.tooltipEl.innerText = this.appTooltip;

    Object.assign(this.tooltipEl.style, {
      position: 'fixed',
      background: '#333',
      color: '#fff',
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '0.75rem',
      whiteSpace: 'nowrap',
      zIndex: '9999',
      pointerEvents: 'none',
    });

    document.body.appendChild(this.tooltipEl);

    // Posicionamos el tooltip justo debajo del elemento
    const rect = this.el.nativeElement.getBoundingClientRect();
    this.tooltipEl.style.top = `${rect.bottom + 6}px`;
    this.tooltipEl.style.left = `${rect.left}px`;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.tooltipEl) {
      document.body.removeChild(this.tooltipEl);
      this.tooltipEl = null;
    }
  }

  // Si el elemento se destruye mientras el tooltip está visible, lo limpiamos
  @HostListener('click')
  onClick() {
    if (this.tooltipEl) {
      document.body.removeChild(this.tooltipEl);
      this.tooltipEl = null;
    }
  }
}
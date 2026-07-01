import {
  Directive,
  Input,
  HostListener,
  ElementRef,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective {
  // Texto que se muestra en el tooltip
  @Input() appTooltip = '';

  // Referencia al elemento del tooltip que creamos dinámicamente
  private tooltipEl: HTMLElement | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  // Cuando el mouse entra al elemento → creamos y mostramos el tooltip
  @HostListener('mouseenter')
  onMouseEnter() {
    if (!this.appTooltip) return;

    // Creamos el elemento del tooltip dinámicamente
    this.tooltipEl = this.renderer.createElement('span');
    this.renderer.appendChild(
      this.tooltipEl,
      this.renderer.createText(this.appTooltip),
    );

    // Estilos del tooltip
    this.renderer.setStyle(this.tooltipEl, 'position', 'absolute');
    this.renderer.setStyle(this.tooltipEl, 'background', '#333');
    this.renderer.setStyle(this.tooltipEl, 'color', '#fff');
    this.renderer.setStyle(this.tooltipEl, 'padding', '4px 10px');
    this.renderer.setStyle(this.tooltipEl, 'border-radius', '6px');
    this.renderer.setStyle(this.tooltipEl, 'font-size', '0.75rem');
    this.renderer.setStyle(this.tooltipEl, 'white-space', 'nowrap');
    this.renderer.setStyle(this.tooltipEl, 'z-index', '9999');
    this.renderer.setStyle(this.tooltipEl, 'pointer-events', 'none');
    this.renderer.setStyle(this.tooltipEl, 'margin-top', '4px');

    // Lo agregamos al elemento host para que se posicione relativo a él
    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
    this.renderer.appendChild(this.el.nativeElement, this.tooltipEl);
  }

  // Cuando el mouse sale → eliminamos el tooltip
  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.tooltipEl) {
      this.renderer.removeChild(this.el.nativeElement, this.tooltipEl);
      this.tooltipEl = null;
    }
  }
}
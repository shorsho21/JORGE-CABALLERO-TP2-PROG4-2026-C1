import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Navbar } from '../../components/navbar/navbar';
import { Chart, registerables } from 'chart.js';
import { TiempoRelativoPipe } from '../../pipes/tiempo-relativo.pipe';
import { NombrePerfilPipe } from '../../pipes/nombre-perfil.pipe';
import { ResaltarDeshabilitadoDirective } from '../../directives/resaltar-deshabilitado.directive';
import { TooltipDirective } from '../../directives/tooltip.directive';
import { ClickCopiarDirective } from '../../directives/click-copiar.directive';
// Registramos todos los tipos de gráficos de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    Navbar,
    TiempoRelativoPipe,
    NombrePerfilPipe,
    ResaltarDeshabilitadoDirective,
    TooltipDirective,
    ClickCopiarDirective,
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit, OnDestroy, AfterViewInit {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  // ── ESTADO GENERAL ────────────────────────────────────────────────────────

  // Tab activo: 'usuarios' o 'estadisticas'
  tabActivo = 'usuarios';

  currentUser: any = null;
  loading = false;

  // ── USUARIOS ──────────────────────────────────────────────────────────────

  usuarios: any[] = [];
  mostrarFormUsuario = false;
  loadingUsuario = false;

  // Modal de feedback
  showModal = false;
  modalMessage = '';
  modalType: 'success' | 'error' = 'success';

  formUsuario: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    fechaNacimiento: ['', Validators.required],
    descripcion: [''],
    // Radio button para elegir el perfil del nuevo usuario
    perfil: ['usuario', Validators.required],
  });

  // ── ESTADÍSTICAS ──────────────────────────────────────────────────────────

  // Fechas del filtro de tiempo — por defecto el último mes
  desdeStats = this.fechaHaceMeses(1);
  hastaStats = this.fechaHoy();

  loadingStats = false;

  // Referencias a los canvas donde se renderizan los gráficos
  @ViewChild('chartBarras') chartBarrasRef!: ElementRef;
  @ViewChild('chartLineas') chartLineasRef!: ElementRef;
  @ViewChild('chartTorta') chartTortaRef!: ElementRef;

  // Instancias de Chart.js — las guardamos para poder destruirlas antes de recrear
  private chartBarras: Chart | null = null;
  private chartLineas: Chart | null = null;
  private chartTorta: Chart | null = null;

  // ── LIFECYCLE ─────────────────────────────────────────────────────────────

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.cargarUsuarios();
  }

  ngAfterViewInit() {
    // Los canvas solo están disponibles después de que el DOM renderizó
    // pero los gráficos los cargamos manualmente cuando el usuario cambia al tab
  }

  ngOnDestroy() {
    // Destruimos los gráficos al salir de la página para liberar memoria
    this.destruirGraficos();
  }

  // ── TABS ──────────────────────────────────────────────────────────────────

  cambiarTab(tab: string) {
    this.tabActivo = tab;

    // Cuando el usuario entra al tab de estadísticas por primera vez
    // esperamos un tick para que el DOM renderice los canvas antes de dibujar
    if (tab === 'estadisticas') {
      setTimeout(() => this.cargarEstadisticas(), 100);
    }
  }

  // ── USUARIOS ──────────────────────────────────────────────────────────────

  cargarUsuarios() {
    this.loading = true;
    this.authService.getUsers().subscribe({
      next: (res: any) => {
        this.usuarios = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  crearUsuario() {
    if (this.formUsuario.invalid) {
      this.openModal('Completá todos los campos correctamente', 'error');
      return;
    }

    this.loadingUsuario = true;

    // Armamos el FormData igual que en el registro
    const formData = new FormData();
    const valores = this.formUsuario.value;
    Object.keys(valores).forEach((key) => {
      if (valores[key]) formData.append(key, valores[key]);
    });

    this.authService.createUser(formData).subscribe({
      next: () => {
        this.openModal('Usuario creado correctamente', 'success');
        this.formUsuario.reset({ perfil: 'usuario' });
        this.mostrarFormUsuario = false;
        this.loadingUsuario = false;
        this.cargarUsuarios();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.openModal(err.error?.message || 'Error al crear el usuario', 'error');
        this.loadingUsuario = false;
        this.cdr.detectChanges();
      },
    });
  }

  deshabilitar(userId: string) {
    this.authService.deshabilitarUsuario(userId).subscribe({
      next: () => {
        // Actualizamos el estado en la lista local sin recargar todo
        const user = this.usuarios.find((u) => u._id === userId);
        if (user) user.habilitado = false;
        this.cdr.detectChanges();
      },
    });
  }

  rehabilitar(userId: string) {
    this.authService.rehabilitarUsuario(userId).subscribe({
      next: () => {
        const user = this.usuarios.find((u) => u._id === userId);
        if (user) user.habilitado = true;
        this.cdr.detectChanges();
      },
    });
  }

  // ── ESTADÍSTICAS ──────────────────────────────────────────────────────────

  cargarEstadisticas() {
    console.log('chartBarrasRef:', this.chartBarrasRef);
    console.log('chartLineasRef:', this.chartLineasRef);
    console.log('chartTortaRef:', this.chartTortaRef);
    this.loadingStats = true;
    this.destruirGraficos();

    let completadas = 0;
    const total = 3;

    const verificar = () => {
      completadas++;
      if (completadas === total) {
        this.loadingStats = false;
        this.cdr.detectChanges();
      }
    };

    // Gráfico de barras — publicaciones por usuario
    this.authService.getPublicacionesPorUsuario(this.desdeStats, this.hastaStats).subscribe({
      next: (res: any) => {
        this.crearGraficoBarras(res);
        verificar();
      },
      error: () => verificar(),
    });

    // Gráfico de líneas — comentarios por día
    this.authService.getComentariosPorTiempo(this.desdeStats, this.hastaStats).subscribe({
      next: (res: any) => {
        this.crearGraficoLineas(res);
        verificar();
      },
      error: () => verificar(),
    });

    // Gráfico de torta — comentarios por publicación
    this.authService.getComentariosPorPublicacion(this.desdeStats, this.hastaStats).subscribe({
      next: (res: any) => {
        this.crearGraficoTorta(res);
        verificar();
      },
      error: () => verificar(),
    });
  }

  private crearGraficoBarras(data: any[]) {
    if (!this.chartBarrasRef) return;
    const ctx = this.chartBarrasRef.nativeElement.getContext('2d');

    this.chartBarras = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map((d) => d.username),
        datasets: [
          {
            label: 'Publicaciones',
            data: data.map((d) => d.total),
            backgroundColor: 'rgba(99, 102, 241, 0.7)',
            borderColor: 'rgba(99, 102, 241, 1)',
            borderWidth: 1,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: '#aaa' } },
        },
        scales: {
          x: { ticks: { color: '#aaa' }, grid: { color: '#2a2a2a' } },
          y: {
            ticks: { color: '#aaa', stepSize: 1 },
            grid: { color: '#2a2a2a' },
            beginAtZero: true,
          },
        },
      },
    });
  }

  private crearGraficoLineas(data: any[]) {
    if (!this.chartLineasRef) return;
    const ctx = this.chartLineasRef.nativeElement.getContext('2d');

    this.chartLineas = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map((d) => d.fecha),
        datasets: [
          {
            label: 'Comentarios por día',
            data: data.map((d) => d.total),
            borderColor: 'rgba(52, 211, 153, 1)',
            backgroundColor: 'rgba(52, 211, 153, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: 'rgba(52, 211, 153, 1)',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: '#aaa' } },
        },
        scales: {
          x: { ticks: { color: '#aaa' }, grid: { color: '#2a2a2a' } },
          y: {
            ticks: { color: '#aaa', stepSize: 1 },
            grid: { color: '#2a2a2a' },
            beginAtZero: true,
          },
        },
      },
    });
  }

  private crearGraficoTorta(data: any[]) {
    if (!this.chartTortaRef) return;
    const ctx = this.chartTortaRef.nativeElement.getContext('2d');

    const colores = [
      '#6366f1',
      '#34d399',
      '#f59e0b',
      '#ef4444',
      '#8b5cf6',
      '#06b6d4',
      '#f97316',
      '#ec4899',
    ];

    this.chartTorta = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map((d) => d.titulo),
        datasets: [
          {
            data: data.map((d) => d.total),
            backgroundColor: colores.slice(0, data.length),
            borderColor: '#1a1a1a',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#aaa', padding: 16 },
          },
        },
      },
    });
  }

  private destruirGraficos() {
    // Destruimos las instancias anteriores antes de crear nuevas
    // Si no lo hacemos, Chart.js tira error de "canvas already in use"
    this.chartBarras?.destroy();
    this.chartLineas?.destroy();
    this.chartTorta?.destroy();
    this.chartBarras = null;
    this.chartLineas = null;
    this.chartTorta = null;
  }

  // ── HELPERS ───────────────────────────────────────────────────────────────

  openModal(message: string, type: 'success' | 'error') {
    this.modalMessage = message;
    this.modalType = type;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  // Devuelve la fecha de hoy en formato YYYY-MM-DD para el input date
  private fechaHoy(): string {
    return new Date().toISOString().split('T')[0];
  }

  // Devuelve la fecha de hace N meses en formato YYYY-MM-DD
  private fechaHaceMeses(meses: number): string {
    const d = new Date();
    d.setMonth(d.getMonth() - meses);
    return d.toISOString().split('T')[0];
  }
}

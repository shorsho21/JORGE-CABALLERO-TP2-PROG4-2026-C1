// src/app/pages/post-detail/post-detail.ts ← archivo nuevo

import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Navbar } from '../../components/navbar/navbar';
import { TiempoRelativoPipe } from '../../pipes/tiempo-relativo.pipe';
@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [ FormsModule, DatePipe, Navbar, TiempoRelativoPipe],
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.css',
})
export class PostDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  // Usuario logueado, lo leemos del localStorage
  currentUser: any = null;

  // Datos de la publicación que estamos viendo
  post: any = null;

  // Lista de comentarios cargados hasta el momento
  comentarios: any[] = [];

  // Control de paginación de comentarios
  offsetComentarios = 0;
  limitComentarios = 5;

  // true si hay más comentarios para cargar (para mostrar/ocultar el botón "cargar más")
  hayMasComentarios = true;

  // Controla el spinner general de la página
  loading = false;

  // Controla el spinner del botón "cargar más"
  loadingMas = false;

  // Texto del nuevo comentario que está escribiendo el usuario
  nuevoComentario = '';

  // Cuando es distinto de null, significa que estamos editando ese comentario
  comentarioEditandoId: string | null = null;

  // Texto temporal mientras se edita un comentario
  textoEditando = '';

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    // Leemos el id de la publicación desde la URL (/posts/:id)
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.cargarPost(postId);
      this.cargarComentarios(postId);
    }
  }

  // ── CARGAR POST ───────────────────────────────────────────────────────────
  cargarPost(postId: string) {
    this.loading = true;
    this.authService.getPostById(postId).subscribe({
      next: (res: any) => {
        this.post = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  // ── CARGAR COMENTARIOS ────────────────────────────────────────────────────
  // firstLoad = true significa que es la primera carga (reseteamos la lista)
  // firstLoad = false significa que el usuario clickeó "cargar más"
  cargarComentarios(postId: string, firstLoad = true) {
    if (firstLoad) {
      // Primera carga: reseteamos todo
      this.offsetComentarios = 0;
      this.comentarios = [];
      this.loading = true;
    } else {
      // Carga adicional: solo mostramos el spinner del botón
      this.loadingMas = true;
    }

    this.authService
      .getComentarios(postId, this.offsetComentarios, this.limitComentarios)
      .subscribe({
        next: (res: any) => {
          // Agregamos los nuevos comentarios a los que ya teníamos
          this.comentarios = [...this.comentarios, ...res];

          // Si recibimos menos comentarios de los que pedimos, no hay más para cargar
          this.hayMasComentarios = res.length === this.limitComentarios;

          // Avanzamos el offset para la próxima carga
          this.offsetComentarios += this.limitComentarios;

          this.loading = false;
          this.loadingMas = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.loadingMas = false;
          this.cdr.detectChanges();
        },
      });
  }

  // ── CARGAR MÁS COMENTARIOS ────────────────────────────────────────────────
  cargarMas() {
    if (this.post) {
      this.cargarComentarios(this.post._id, false);
    }
  }

  // ── ENVIAR COMENTARIO ─────────────────────────────────────────────────────
  enviarComentario() {
    if (!this.nuevoComentario.trim() || !this.post) return;

    this.authService.createComentario(this.post._id, this.nuevoComentario.trim()).subscribe({
      next: (res: any) => {
        this.comentarios = [res, ...this.comentarios];
        this.nuevoComentario = '';

        // Sumamos 1 al offset porque ahora hay un comentario más en la lista
        // que el backend no contó dentro de la paginación todavía
        this.offsetComentarios += 1;

        this.cdr.detectChanges();
      },
    });
  }

  // ── INICIAR EDICIÓN ───────────────────────────────────────────────────────
  // Activa el modo edición para un comentario específico
  iniciarEdicion(comentario: any) {
    this.comentarioEditandoId = comentario._id;
    // Precargamos el texto actual para que el usuario lo pueda modificar
    this.textoEditando = comentario.mensaje;
  }

  // ── CANCELAR EDICIÓN ──────────────────────────────────────────────────────
  cancelarEdicion() {
    this.comentarioEditandoId = null;
    this.textoEditando = '';
  }

  // ── GUARDAR EDICIÓN ───────────────────────────────────────────────────────
  guardarEdicion(comentario: any) {
    if (!this.textoEditando.trim()) return;

    this.authService.updateComentario(comentario._id, this.textoEditando.trim()).subscribe({
      next: (res: any) => {
        // Actualizamos el comentario en la lista local sin recargar todo
        const index = this.comentarios.findIndex((c) => c._id === comentario._id);
        if (index !== -1) {
          this.comentarios[index] = res;
        }
        this.cancelarEdicion();
        this.cdr.detectChanges();
      },
    });
  }

  // ── HELPERS ───────────────────────────────────────────────────────────────

  // Devuelve true si el comentario pertenece al usuario logueado
  // Lo usamos en el template para mostrar/ocultar el botón de editar
  esAutorComentario(comentario: any): boolean {
    return comentario.autorId?._id === this.currentUser?._id;
  }
}

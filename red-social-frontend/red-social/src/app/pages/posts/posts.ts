import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe],
  templateUrl: './posts.html',
  styleUrl: './posts.css',
})
export class Posts implements OnInit {
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  posts: any[] = [];
  currentUser: any = null;
  orderBy: 'fecha' | 'likes' = 'fecha';
  offset = 0;
  limit = 10;
  loading = false;

  nuevoTitulo = '';
  nuevaDescripcion = '';
  selectedFile: File | null = null;

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.loadPosts();
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  loadPosts() {
    this.loading = true;
    this.authService.getPosts(this.offset, this.limit, this.orderBy).subscribe({
      next: (res: any) => {
        this.posts = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  createPost() {
    if (!this.nuevoTitulo || !this.nuevaDescripcion) return;

    const formData = new FormData();
    formData.append('titulo', this.nuevoTitulo);
    formData.append('descripcion', this.nuevaDescripcion);
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.authService.createPost(formData).subscribe({
      next: () => {
        this.nuevoTitulo = '';
        this.nuevaDescripcion = '';
        this.selectedFile = null;
        this.loadPosts();
      }
    });
  }

  changeOrder(order: 'fecha' | 'likes') {
    this.orderBy = order;
    this.offset = 0;
    this.loadPosts();
  }

  nextPage() {
    this.offset += this.limit;
    this.loadPosts();
  }

  prevPage() {
    if (this.offset > 0) {
      this.offset -= this.limit;
      this.loadPosts();
    }
  }

  toggleLike(post: any) {
    const userId = this.currentUser._id;
    const yaLiked = post.likes.some((id: string) => id === userId);

    if (yaLiked) {
      this.authService.removeLike(post._id).subscribe({
        next: () => this.loadPosts()
      });
    } else {
      this.authService.addLike(post._id).subscribe({
        next: () => this.loadPosts()
      });
    }
  }

  deletePost(postId: string) {
    this.authService.deletePost(postId).subscribe({
      next: () => this.loadPosts()
    });
  }

  esAutor(post: any) {
    return post.autor._id === this.currentUser._id;
  }

  esAdmin() {
    return this.currentUser.perfil === 'administrador';
  }
}
import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { PublicadorService } from '../../services/publicador.service';
import { AuthService, User } from '../../auth/auth.service';
import { JuegoPublicado } from '../../Model/juego-publicado';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  showProfileMenu = false;
  misJuegos: JuegoPublicado[] = [];
  mostrarFormulario = false;
  guardadoOk = false;
  errorMsg = '';

  readonly TAGS_DISPONIBLES = ['Acción', 'RPG', 'Aventura', 'Estrategia', 'Deportes',
    'Simulación', 'Terror', 'Plataformas', 'Shooter', 'Puzzle', 'Indie', 'Multijugador'];
  readonly PLATAFORMAS_DISPONIBLES = ['Windows', 'macOS', 'Linux', 'PlayStation', 'Xbox'];

  form = {
    nombre: '',
    precio: null as number | null,
    descuento: 0,
    descripcion: '',
    imagen: '',
    tags: [] as string[],
    plataformas: [] as string[]
  };

  constructor(
    private publicadorService: PublicadorService,
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.user$.subscribe(u => {
      this.user = u;
      if (!u) { this.router.navigate(['/login']); return; }
      if (u.rol !== 'empresa') { this.router.navigate(['/']); return; }
      this.cargarJuegos();
    });
  }

  ngOnInit(): void {}

  cargarJuegos(): void {
    if (this.user) {
      this.misJuegos = this.publicadorService.getJuegosDeEmpresa(this.user.email);
    }
  }

  toggleTag(tag: string): void {
    const idx = this.form.tags.indexOf(tag);
    if (idx >= 0) this.form.tags.splice(idx, 1);
    else this.form.tags.push(tag);
  }

  togglePlataforma(p: string): void {
    const idx = this.form.plataformas.indexOf(p);
    if (idx >= 0) this.form.plataformas.splice(idx, 1);
    else this.form.plataformas.push(p);
  }

  tieneTag(tag: string): boolean { return this.form.tags.includes(tag); }
  tienePlataforma(p: string): boolean { return this.form.plataformas.includes(p); }

  publicar(): void {
    this.errorMsg = '';
    if (!this.form.nombre.trim()) { this.errorMsg = 'El nombre es obligatorio.'; return; }
    if (!this.form.precio || this.form.precio <= 0) { this.errorMsg = 'El precio debe ser mayor a 0.'; return; }
    if (!this.form.descripcion.trim()) { this.errorMsg = 'La descripción es obligatoria.'; return; }
    if (this.form.tags.length === 0) { this.errorMsg = 'Selecciona al menos una categoría.'; return; }
    if (this.form.plataformas.length === 0) { this.errorMsg = 'Selecciona al menos una plataforma.'; return; }

    this.publicadorService.publicar({
      nombre: this.form.nombre.trim(),
      precio: this.form.precio,
      descuento: this.form.descuento,
      descripcion: this.form.descripcion.trim(),
      imagen: this.form.imagen.trim() || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600',
      tags: [...this.form.tags],
      plataformas: [...this.form.plataformas],
      empresaNombre: this.user!.nombre,
      empresaEmail: this.user!.email
    });

    this.cargarJuegos();
    this.resetForm();
    this.mostrarFormulario = false;
    this.guardadoOk = true;
    setTimeout(() => this.guardadoOk = false, 3000);
  }

  eliminar(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este juego?')) {
      this.publicadorService.eliminar(id);
      this.cargarJuegos();
    }
  }

  toggleActivo(id: string): void {
    this.publicadorService.toggleActivo(id);
    this.cargarJuegos();
  }

  resetForm(): void {
    this.form = { nombre: '', precio: null, descuento: 0, descripcion: '', imagen: '', tags: [], plataformas: [] };
    this.errorMsg = '';
  }

  cancelar(): void {
    this.resetForm();
    this.mostrarFormulario = false;
  }

  toggleProfileMenu() { this.showProfileMenu = !this.showProfileMenu; }

  logout() {
    this.authService.logout();
    this.showProfileMenu = false;
    this.router.navigate(['/']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('.profile-wrap')) {
      this.showProfileMenu = false;
    }
  }

  contarActivos(): number { return this.misJuegos.filter(j => j.activo).length; }
  getInitials(): string { return this.user?.nombre.charAt(0).toUpperCase() ?? ''; }
  isImageAvatar(): boolean { return !!this.user?.avatar && this.user.avatar.startsWith('data:'); }
}

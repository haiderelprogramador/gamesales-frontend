import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../auth/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  user: User | null = null;
  activeTab: 'info' | 'seguridad' = 'info';

  // Formulario de edición
  editNombre = '';
  editEmail = '';
  saveSuccess = false;

  // Avatar
  showAvatarPanel = false;
  avatarColors = [
    'linear-gradient(135deg, #47bfff, #1a44c2)',
    'linear-gradient(135deg, #a4d007, #4c6b22)',
    'linear-gradient(135deg, #ff6b6b, #c0392b)',
    'linear-gradient(135deg, #f39c12, #d35400)',
    'linear-gradient(135deg, #9b59b6, #6c3483)',
    'linear-gradient(135deg, #1abc9c, #0e6655)',
    'linear-gradient(135deg, #e91e63, #880e4f)',
    'linear-gradient(135deg, #66c0f4, #2a475e)',
  ];

  // Seguridad
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  passwordError = '';
  passwordSuccess = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.user$.subscribe(u => {
      this.user = u;
      if (u) {
        this.editNombre = u.nombre;
        this.editEmail = u.email;
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  setTab(tab: 'info' | 'seguridad') {
    this.activeTab = tab;
    this.saveSuccess = false;
    this.passwordSuccess = false;
    this.passwordError = '';
  }

  getInitials(): string {
    if (!this.user) return '';
    return this.user.nombre.charAt(0).toUpperCase();
  }

  isImageAvatar(): boolean {
    return !!this.user?.avatar && this.user.avatar.startsWith('data:');
  }

  getAvatarBackground(): string {
    if (!this.user?.avatar) return this.avatarColors[0];
    if (this.user.avatar.startsWith('data:')) return '';
    return this.user.avatar;
  }

  // Guardar cambios de info
  saveInfo() {
    if (!this.editNombre.trim()) return;
    this.authService.updateUser({
      nombre: this.editNombre.trim(),
      email: this.editEmail.trim()
    });
    this.saveSuccess = true;
    setTimeout(() => this.saveSuccess = false, 3000);
  }

  // Cambiar color de avatar
  selectColor(color: string) {
    this.authService.updateAvatar(color);
    this.showAvatarPanel = false;
  }

  // Subir imagen de avatar
  onAvatarFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.authService.updateAvatar(reader.result as string);
      this.showAvatarPanel = false;
    };
    reader.readAsDataURL(file);
  }

  // Cambiar contraseña (mock — validación visual, sin backend aún)
  changePassword() {
    this.passwordError = '';
    this.passwordSuccess = false;

    if (!this.currentPassword) {
      this.passwordError = 'Ingresa tu contraseña actual.';
      return;
    }
    if (this.newPassword.length < 6) {
      this.passwordError = 'La nueva contraseña debe tener al menos 6 caracteres.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = 'Las contraseñas no coinciden.';
      return;
    }

    // Cuando el backend esté listo: llamar al servicio HTTP aquí
    this.passwordSuccess = true;
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    setTimeout(() => this.passwordSuccess = false, 3000);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.avatar-edit-wrap')) {
      this.showAvatarPanel = false;
    }
  }
}

import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LibraryService } from '../../services/library.service';
import { AuthService, User } from '../../auth/auth.service';
import { Producto } from '../../Model/producto';

@Component({
  selector: 'app-mis-juegos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mis-juegos.component.html',
  styleUrls: ['./mis-juegos.component.css']
})
export class MisJuegosComponent implements OnInit {
  user: User | null = null;
  showProfileMenu = false;
  games: Producto[] = [];

  constructor(
    private libraryService: LibraryService,
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.user$.subscribe(u => {
      this.user = u;
      if (!u) this.router.navigate(['/login']);
    });
  }

  ngOnInit(): void {
    this.games = this.libraryService.getGames();
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

  getInitials(): string {
    return this.user?.nombre.charAt(0).toUpperCase() ?? '';
  }

  isImageAvatar(): boolean {
    return !!this.user?.avatar && this.user.avatar.startsWith('data:');
  }
}

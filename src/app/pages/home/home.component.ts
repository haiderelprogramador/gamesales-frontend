import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService, User } from '../../auth/auth.service';
import { Producto } from '../../Model/producto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  cartItemCount = 0;
  showNotification = false;
  lastAddedProduct = '';
  activeTab = 'destacados';

  user: User | null = null;
  showProfileMenu = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {
    this.cartService.cartCount$.subscribe(count => this.cartItemCount = count);
    this.authService.user$.subscribe(u => this.user = u);
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  logout() {
    this.authService.logout();
    this.showProfileMenu = false;
  }

  // Cierra el menú al hacer click fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-wrap')) {
      this.showProfileMenu = false;
    }
  }

  addToCart() {
    const producto: Producto = {
      nombre: 'Cyber Nexus: Reborn',
      precio: 39.99,
      imagen: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500'
    };

    this.cartService.addToCart(producto);
    this.lastAddedProduct = producto.nombre;
    this.showNotification = true;

    setTimeout(() => {
      this.showNotification = false;
    }, 2500);
  }

  getInitials(): string {
    if (!this.user) return '';
    return this.user.nombre.charAt(0).toUpperCase();
  }
}

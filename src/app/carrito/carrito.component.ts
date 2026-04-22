import { Component, OnInit, HostListener } from '@angular/core';
import { CartService } from '../services/cart.service';
import { LibraryService } from '../services/library.service';
import { Producto } from '../Model/producto';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../auth/auth.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  items: Producto[] = [];
  total: number = 0;

  user: User | null = null;
  showProfileMenu = false;

  constructor(
    private cartService: CartService,
    private libraryService: LibraryService,
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.user$.subscribe(u => this.user = u);
  }

  ngOnInit() {
    this.loadCartItems();
    this.cartService.cartCount$.subscribe(() => {
      this.loadCartItems();
    });
  }

  loadCartItems() {
    this.items = this.cartService.getItems();
    this.calcularTotal();
  }

  eliminar(index: number) {
    this.cartService.removeItem(index);
    this.loadCartItems();
  }

  calcularTotal() {
    this.total = this.cartService.getTotal();
  }

  vaciarCarrito() {
    this.cartService.clearCart();
    this.loadCartItems();
  }

  procederPago() {
    if (this.items.length === 0) {
      return;
    }
    alert(`Procesando pago de $${this.total.toFixed(2)}...`);
    setTimeout(() => {
      this.libraryService.addGames(this.items);
      this.vaciarCarrito();
      alert('¡Compra realizada con éxito! Tus juegos están en "Mi biblioteca".');
    }, 2000);
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  logout() {
    this.authService.logout();
    this.showProfileMenu = false;
    this.router.navigate(['/']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-wrap')) {
      this.showProfileMenu = false;
    }
  }

  getInitials(): string {
    if (!this.user) return '';
    return this.user.nombre.charAt(0).toUpperCase();
  }

  isImageAvatar(): boolean {
    return !!this.user?.avatar && this.user.avatar.startsWith('data:');
  }
}

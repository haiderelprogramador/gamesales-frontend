import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { AuthService, User } from '../../auth/auth.service';
import { Producto } from '../../Model/producto';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  user: User | null = null;
  showProfileMenu = false;
  items: Producto[] = [];
  addedToCart: string[] = [];

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.user$.subscribe(u => {
      this.user = u;
      if (!u) this.router.navigate(['/login']);
    });
  }

  ngOnInit(): void {
    this.items = this.wishlistService.getItems();
  }

  remove(nombre: string): void {
    this.wishlistService.remove(nombre);
    this.items = this.wishlistService.getItems();
  }

  addToCart(item: Producto): void {
    this.cartService.addToCart(item);
    this.addedToCart.push(item.nombre);
    setTimeout(() => {
      this.addedToCart = this.addedToCart.filter(n => n !== item.nombre);
    }, 2000);
  }

  isAddedToCart(nombre: string): boolean {
    return this.addedToCart.includes(nombre);
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

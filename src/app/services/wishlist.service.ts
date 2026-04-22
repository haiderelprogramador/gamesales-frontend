import { Injectable } from '@angular/core';
import { Producto } from '../Model/producto';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private items: Producto[] = [];
  private count = new BehaviorSubject<number>(0);
  wishlistCount$ = this.count.asObservable();

  constructor() {
    const saved = localStorage.getItem('gamesell_wishlist');
    if (saved) {
      this.items = JSON.parse(saved);
      this.count.next(this.items.length);
    }
  }

  getItems(): Producto[] {
    return this.items;
  }

  isInWishlist(nombre: string): boolean {
    return this.items.some(i => i.nombre === nombre);
  }

  toggle(producto: Producto): boolean {
    const idx = this.items.findIndex(i => i.nombre === producto.nombre);
    if (idx >= 0) {
      this.items.splice(idx, 1);
    } else {
      this.items.push({ ...producto, fechaAgregado: new Date().toLocaleDateString('es-ES') });
    }
    this.save();
    return !( idx >= 0 );
  }

  remove(nombre: string): void {
    this.items = this.items.filter(i => i.nombre !== nombre);
    this.save();
  }

  private save(): void {
    localStorage.setItem('gamesell_wishlist', JSON.stringify(this.items));
    this.count.next(this.items.length);
  }
}

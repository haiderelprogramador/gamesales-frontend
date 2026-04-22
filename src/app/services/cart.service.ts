import { Injectable } from '@angular/core';
import { Producto } from '../Model/producto';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: Producto[] = [];
  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable(); // Esto es lo que te faltaba

  constructor() {
    // Cargar carrito guardado si existe
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.items = JSON.parse(savedCart);
      this.updateCartCount();
    }
  }

  addToCart(product: Producto) {
    this.items.push(product);
    this.saveCart();
    this.updateCartCount();
    console.log('Producto agregado:', product);
    console.log('Carrito actual:', this.items);
  }

  getItems(): Producto[] {
    return this.items;
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
    this.saveCart();
    this.updateCartCount();
  }

  clearCart() {
    this.items = [];
    this.saveCart();
    this.updateCartCount();
  }

  getTotal(): number {
    return this.items.reduce((total, item) => total + item.precio, 0);
  }

  getItemCount(): number {
    return this.items.length;
  }

  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  private updateCartCount() {
    this.cartCount.next(this.items.length);
  }
}
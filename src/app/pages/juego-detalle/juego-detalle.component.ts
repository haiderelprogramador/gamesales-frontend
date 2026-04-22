import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService, User } from '../../auth/auth.service';
import { Producto } from '../../Model/producto';

interface Juego {
  slug: string;
  nombre: string;
  developer: string;
  publisher: string;
  fechaLanzamiento: string;
  precio: number;
  precioOriginal: number;
  descuento: number;
  imagen: string;
  imagenHero: string;
  screenshots: string[];
  tags: string[];
  descripcion: string;
  reviewScore: string;
  reviewCount: string;
  reviewColor: string;
  plataformas: string[];
  caracteristicas: string[];
  reqMin: { os: string; cpu: string; ram: string; gpu: string; almacenamiento: string };
  reqRec: { os: string; cpu: string; ram: string; gpu: string; almacenamiento: string };
}

@Component({
  selector: 'app-juego-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './juego-detalle.component.html',
  styleUrls: ['./juego-detalle.component.css']
})
export class JuegoDetalleComponent implements OnInit {
  juego!: Juego;
  activeScreenshot = 0;
  showNotification = false;
  activeTab: 'descripcion' | 'requisitos' | 'resenas' = 'descripcion';

  user: User | null = null;
  showProfileMenu = false;
  inWishlist = false;

  private juegos: Juego[] = [
    {
      slug: 'cyber-nexus-reborn',
      nombre: 'Cyber Nexus: Reborn',
      developer: 'NeonStudio',
      publisher: 'GameSales Publishing',
      fechaLanzamiento: '15 Mar, 2024',
      precio: 39.99,
      precioOriginal: 59.99,
      descuento: 33,
      imagen: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600',
      imagenHero: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200',
      screenshots: [
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
        'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=800',
        'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=800',
        'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800',
      ],
      tags: ['Acción', 'Cyberpunk', 'RPG', 'Mundo abierto', 'Un jugador'],
      descripcion: 'Explora Neo-Tokyo 2088, una megalópolis controlada por corporaciones poderosas. Eres un mercenario de élite con habilidades de hackeo que debe infiltrarse en los sistemas más seguros del mundo. Cada decisión moldea tu historia en este RPG de acción de mundo abierto donde la tecnología y la humanidad colisionan.',
      reviewScore: 'Muy positivas',
      reviewCount: '12,483',
      reviewColor: '#66c0f4',
      plataformas: ['Windows', 'macOS'],
      caracteristicas: [
        'Un jugador',
        'Logros del juego',
        'Guardado en la nube',
        'Soporte para mandos',
        'Subtítulos en español',
        'Voces en inglés / japonés'
      ],
      reqMin: {
        os: 'Windows 10 64-bit',
        cpu: 'Intel Core i5-8400 / AMD Ryzen 5 2600',
        ram: '12 GB RAM',
        gpu: 'NVIDIA GTX 1060 6GB / AMD RX 580 8GB',
        almacenamiento: '70 GB disponibles'
      },
      reqRec: {
        os: 'Windows 11 64-bit',
        cpu: 'Intel Core i7-10700K / AMD Ryzen 7 3700X',
        ram: '16 GB RAM',
        gpu: 'NVIDIA RTX 3070 / AMD RX 6800 XT',
        almacenamiento: '70 GB SSD'
      }
    },
    {
      slug: 'dragons-wrath',
      nombre: "Dragon's Wrath",
      developer: 'Mythforge Studios',
      publisher: 'Mythforge Studios',
      fechaLanzamiento: '22 Ene, 2024',
      precio: 29.99,
      precioOriginal: 54.99,
      descuento: 45,
      imagen: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=600',
      imagenHero: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=1200',
      screenshots: [
        'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=800',
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
        'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800',
        'https://images.unsplash.com/photo-1535223289429-462ea9301402?w=800',
      ],
      tags: ['RPG', 'Fantasía', 'Un jugador', 'Aventura', 'Historia'],
      descripcion: 'Embárcate en una épica aventura a través de tierras mágicas pobladas por dragones ancestrales. Forja tu destino como el último Cazadragones y descubre los secretos de un reino al borde del colapso. Con un sistema de combate profundo y una historia ramificada, cada partida es única.',
      reviewScore: 'Muy positivas',
      reviewCount: '8,291',
      reviewColor: '#66c0f4',
      plataformas: ['Windows', 'macOS', 'Linux'],
      caracteristicas: [
        'Un jugador',
        'Logros del juego',
        'Guardado en la nube',
        'Soporte para mandos',
        'Subtítulos en español'
      ],
      reqMin: {
        os: 'Windows 10 64-bit',
        cpu: 'Intel Core i5-6600K',
        ram: '8 GB RAM',
        gpu: 'NVIDIA GTX 970 / AMD R9 390X',
        almacenamiento: '45 GB disponibles'
      },
      reqRec: {
        os: 'Windows 10/11 64-bit',
        cpu: 'Intel Core i7-8700K / AMD Ryzen 5 3600',
        ram: '16 GB RAM',
        gpu: 'NVIDIA RTX 2070 / AMD RX 5700 XT',
        almacenamiento: '45 GB SSD'
      }
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private authService: AuthService
  ) {
    this.authService.user$.subscribe(u => this.user = u);
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  logout() {
    this.authService.logout();
    this.showProfileMenu = false;
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

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.juego = this.juegos.find(j => j.slug === slug) ?? this.juegos[0];
    this.inWishlist = this.wishlistService.isInWishlist(this.juego.nombre);
  }

  setScreenshot(index: number) {
    this.activeScreenshot = index;
  }

  setTab(tab: 'descripcion' | 'requisitos' | 'resenas') {
    this.activeTab = tab;
  }

  addToCart() {
    const producto: Producto = {
      nombre: this.juego.nombre,
      precio: this.juego.precio,
      imagen: this.juego.imagen,
      slug: this.juego.slug,
      developer: this.juego.developer,
      tags: this.juego.tags
    };
    this.cartService.addToCart(producto);
    this.showNotification = true;
    setTimeout(() => this.showNotification = false, 2500);
  }

  toggleWishlist() {
    const producto: Producto = {
      nombre: this.juego.nombre,
      precio: this.juego.precio,
      imagen: this.juego.imagen,
      slug: this.juego.slug,
      developer: this.juego.developer,
      tags: this.juego.tags
    };
    this.inWishlist = this.wishlistService.toggle(producto);
  }
}

import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegistrarComponent } from './auth/registrar/registrar.component';
import { CarritoComponent } from './carrito/carrito.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'juego/:slug',
    loadComponent: () =>
      import('./pages/juego-detalle/juego-detalle.component').then(m => m.JuegoDetalleComponent)
  },
  {
    path: 'perfil',
    loadComponent: () =>
      import('./pages/perfil/perfil.component').then(m => m.PerfilComponent)
  },
  {
    path: 'mis-juegos',
    loadComponent: () =>
      import('./pages/mis-juegos/mis-juegos.component').then(m => m.MisJuegosComponent)
  },
  {
    path: 'wishlist',
    loadComponent: () =>
      import('./pages/wishlist/wishlist.component').then(m => m.WishlistComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  { path: 'login', component: LoginComponent },
  { path: 'registrar', component: RegistrarComponent },
  { path: 'carrito', component: CarritoComponent }
];

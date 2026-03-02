import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegistrarComponent } from './auth/registrar/registrar.component';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => 
      import('./pages/home/home.component').then(m => m.HomeComponent) 
  },
  { path: 'login', component: LoginComponent },
  { path: 'registrar', component: RegistrarComponent } 
];
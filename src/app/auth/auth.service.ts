import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface User {
  nombre: string;
  email: string;
  rol: 'jugador' | 'empresa';
  avatar?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    const saved = localStorage.getItem('gamesell_user');
    if (saved) {
      this.userSubject.next(JSON.parse(saved));
    }
  }

  // Mock login para frontend — cuando el backend esté listo,
  // reemplaza el cuerpo de este método con la llamada HTTP
  login(credentials: { email: string; password: string }): Observable<User> {
    const esEmpresa = credentials.email.toLowerCase().includes('empresa') ||
                      credentials.email.toLowerCase().includes('company');
    const mockUser: User = {
      nombre: credentials.email.split('@')[0],
      email: credentials.email,
      rol: esEmpresa ? 'empresa' : 'jugador'
    };
    localStorage.setItem('gamesell_user', JSON.stringify(mockUser));
    this.userSubject.next(mockUser);
    return of(mockUser);
  }

  // Mock registro — reemplazar el cuerpo con llamada HTTP cuando el backend esté listo
  register(data: { nombre: string; email: string; password: string; rol: 'jugador' | 'empresa' }): Observable<User> {
    const newUser: User = { nombre: data.nombre, email: data.email, rol: data.rol };
    localStorage.setItem('gamesell_user', JSON.stringify(newUser));
    this.userSubject.next(newUser);
    return of(newUser);
  }

  logout(): void {
    localStorage.removeItem('gamesell_user');
    this.userSubject.next(null);
  }

  updateUser(changes: Partial<User>): void {
    const current = this.userSubject.getValue();
    if (!current) return;
    const updated = { ...current, ...changes };
    localStorage.setItem('gamesell_user', JSON.stringify(updated));
    this.userSubject.next(updated);
  }

  updateAvatar(avatarData: string): void {
    this.updateUser({ avatar: avatarData });
  }

  getUser(): User | null {
    return this.userSubject.getValue();
  }

  isLoggedIn(): boolean {
    return this.userSubject.getValue() !== null;
  }
}

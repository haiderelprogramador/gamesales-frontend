import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JuegoPublicado } from '../Model/juego-publicado';

@Injectable({ providedIn: 'root' })
export class PublicadorService {
  private juegos: JuegoPublicado[] = [];
  private count = new BehaviorSubject<number>(0);
  count$ = this.count.asObservable();

  constructor() {
    const saved = localStorage.getItem('gamesell_publicados');
    if (saved) {
      this.juegos = JSON.parse(saved);
      this.count.next(this.juegos.length);
    }
  }

  getJuegosDeEmpresa(empresaEmail: string): JuegoPublicado[] {
    return this.juegos.filter(j => j.empresaEmail === empresaEmail);
  }

  publicar(juego: Omit<JuegoPublicado, 'id' | 'fechaPublicacion' | 'activo'>): JuegoPublicado {
    const nuevo: JuegoPublicado = {
      ...juego,
      id: crypto.randomUUID(),
      fechaPublicacion: new Date().toLocaleDateString('es-ES'),
      activo: true
    };
    this.juegos.push(nuevo);
    this.save();
    return nuevo;
  }

  eliminar(id: string): void {
    this.juegos = this.juegos.filter(j => j.id !== id);
    this.save();
  }

  toggleActivo(id: string): void {
    const j = this.juegos.find(j => j.id === id);
    if (j) {
      j.activo = !j.activo;
      this.save();
    }
  }

  private save(): void {
    localStorage.setItem('gamesell_publicados', JSON.stringify(this.juegos));
    this.count.next(this.juegos.length);
  }
}

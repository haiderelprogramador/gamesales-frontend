import { Injectable } from '@angular/core';
import { Producto } from '../Model/producto';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LibraryService {
  private games: Producto[] = [];
  private count = new BehaviorSubject<number>(0);
  libraryCount$ = this.count.asObservable();

  constructor() {
    const saved = localStorage.getItem('gamesell_library');
    if (saved) {
      this.games = JSON.parse(saved);
      this.count.next(this.games.length);
    }
  }

  getGames(): Producto[] {
    return this.games;
  }

  addGames(productos: Producto[]): void {
    const fecha = new Date().toLocaleDateString('es-ES');
    for (const p of productos) {
      if (!this.hasGame(p.nombre)) {
        this.games.push({ ...p, fechaCompra: fecha });
      }
    }
    this.save();
  }

  hasGame(nombre: string): boolean {
    return this.games.some(g => g.nombre === nombre);
  }

  private save(): void {
    localStorage.setItem('gamesell_library', JSON.stringify(this.games));
    this.count.next(this.games.length);
  }
}

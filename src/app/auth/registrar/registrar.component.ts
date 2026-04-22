import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registrar.component.html',
  styleUrl: './registrar.component.css'
})
export class RegistrarComponent {
  rolSeleccionado: 'usuario' | 'compania' = 'usuario';

  formJugador = { nombre: '', email: '', password: '', confirmar: '', terminos: false };
  formEmpresa = { nombre: '', email: '', sitioWeb: '', password: '', confirmar: '', terminos: false };

  errorMsg = '';

  constructor(private authService: AuthService, private router: Router) {}

  cambiarRol(rol: 'usuario' | 'compania') {
    this.rolSeleccionado = rol;
    this.errorMsg = '';
  }

  registrar() {
    this.errorMsg = '';

    if (this.rolSeleccionado === 'usuario') {
      const { nombre, email, password, confirmar, terminos } = this.formJugador;
      if (!nombre.trim() || !email.trim() || !password) { this.errorMsg = 'Completa todos los campos.'; return; }
      if (password !== confirmar) { this.errorMsg = 'Las contraseñas no coinciden.'; return; }
      if (!terminos) { this.errorMsg = 'Debes aceptar los términos de servicio.'; return; }

      this.authService.register({ nombre: nombre.trim(), email: email.trim(), password, rol: 'jugador' })
        .subscribe(() => this.router.navigate(['/']));

    } else {
      const { nombre, email, password, confirmar, terminos } = this.formEmpresa;
      if (!nombre.trim() || !email.trim() || !password) { this.errorMsg = 'Completa todos los campos.'; return; }
      if (password !== confirmar) { this.errorMsg = 'Las contraseñas no coinciden.'; return; }
      if (!terminos) { this.errorMsg = 'Debes aceptar los términos para desarrolladores.'; return; }

      this.authService.register({ nombre: nombre.trim(), email: email.trim(), password, rol: 'empresa' })
        .subscribe(() => this.router.navigate(['/dashboard']));
    }
  }
}

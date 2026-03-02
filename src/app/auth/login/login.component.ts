import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {

      this.authService.login(this.loginForm.value)
        .subscribe({
          next: (res) => {
            console.log('Login exitoso', res);

            // Guardar token
            localStorage.setItem('token', res.token);
          },
          error: (err) => {
            console.error('Error en login', err);
          }
        });

    } else {
      console.log('Formulario inválido');
    }
  }
}
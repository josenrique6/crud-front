import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { LoginRequest } from '../../../models/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  form: FormGroup;
  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.loading = true;

    try {
      const credentials = this.form.getRawValue() as LoginRequest;
      await firstValueFrom(this.authService.login(credentials));
      this.router.navigate(['/facturas/busqueda']);
    } catch (error) {
      this.errorMessage = 'Usuario o contraseña incorrectos.';
    } finally {
      this.loading = false;
    }
  }
}

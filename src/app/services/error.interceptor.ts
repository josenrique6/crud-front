import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';

        if (error.error instanceof ErrorEvent) {
          // Error del cliente
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Error del servidor
          switch (error.status) {
            case 401:
              // No autorizado - limpiar token y redirigir al login
              this.authService.logout();
              this.router.navigate(['/login']);
              errorMessage = 'Sesión expirada. Por favor, inicie sesión nuevamente.';
              break;
            case 403:
              // Prohibido
              errorMessage = 'No tiene permisos para realizar esta acción.';
              break;
            case 404:
              // No encontrado
              errorMessage = 'El recurso solicitado no existe.';
              break;
            case 500:
              // Error interno del servidor
              errorMessage = 'Error interno del servidor. Intente nuevamente más tarde.';
              break;
            default:
              errorMessage = `Error ${error.status}: ${error.message}`;
          }
        }

        console.error('HTTP Error:', errorMessage);
        
        // Retornar el error para que los componentes puedan manejarlo si es necesario
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
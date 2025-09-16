import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly tokenKey = 'auth_token';

  constructor(private http: HttpClient) { }

  login(payload: LoginRequest): Observable<void> {
    const url = `${environment.apiUrl}/Auth/login`;
    return this.http.post<LoginResponse | string>(url, payload, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        accept: 'text/plain'
      })
    }).pipe(
      map(response => {
        if (typeof response === 'string') {
          try {
            const parsed = JSON.parse(response) as LoginResponse;
            if (parsed && typeof parsed.token === 'string') {
              return parsed;
            }
          } catch {
            return { token: response } as LoginResponse;
          }
          return { token: response } as LoginResponse;
        }
        return response;
      }),
      tap(({ token }) => this.saveToken(token)),
      map(() => void 0)
    );
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.tokenKey);
    }
  }

  getToken(): string | null {
    if (!this.isBrowser()) {
      return null;
    }
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private saveToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }
}

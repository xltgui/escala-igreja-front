import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest, LoginResponse } from '../auth/auth-model';
import { Observable, tap } from 'rxjs';

const TOKEN_KEY = 'auth_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // URL do endpoint de login do seu AuthController (POST /auth/login)
  private authUrl = 'http://localhost:8080/auth/login'; 
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) { }

  /**
   * Envia as credenciais, recebe o JWT e o armazena.
   */
  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.authUrl, request).pipe(
      tap(response => {
        // Assume que LoginResponse é { token: string }
        if (response && response.token) {
          this.setToken(response.token);
        }
      })
    );
  }

  logout(): void {
    // Remove o token e, idealmente, recarrega ou redireciona
    localStorage.removeItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    // Lógica básica: verifica se o token existe. 
    // Em produção, você também verificaria a validade/expiração do token.
    return !!token; 
  }

  public cleanUpAuth(): void {
    localStorage.removeItem(TOKEN_KEY); 
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggedUser, LoginRequest, LoginResponse } from '../auth/auth-model';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // URL do endpoint de login do seu AuthController (POST /auth/login)
  private authUrl = 'http://localhost:8080/auth/login'; 
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';

  private currentUserSubject = new BehaviorSubject<LoggedUser | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * Envia as credenciais, recebe o JWT e o armazena.
   */
  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.authUrl, request).pipe(
      tap(response => {
        // Assume que LoginResponse é { token: string }
        if (response && response.token && response.loggedUser) {
          this.setToken(response.token);
          this.setUser(response.loggedUser);
          this.currentUserSubject.next(response.loggedUser);
        }
      })
    );
  }

  logout(): void {
    // Remove o token e, idealmente, recarrega ou redireciona
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);

    this.currentUserSubject.next(null);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setUser(user: LoggedUser): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getStoredUser(): LoggedUser | null {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  getCurrentUser(): LoggedUser | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.roles.includes(role) : false;
  }

  isAdmin$(): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => user ? user.roles.includes('ADMIN') : false)
    );
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

  updateCurrentUser(user: LoggedUser): void {
    this.setUser(user);
    this.currentUserSubject.next(user);
  }
}

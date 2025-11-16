import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth-service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  console.log('🔐 JWT Interceptor - Token:', token);
  console.log('🔐 JWT Interceptor - URL:', req.url);

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('✅ Token adicionado à requisição');
  } else {
    console.log('❌ Token não encontrado');
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('❌ Erro HTTP:', error.status, error.message);
      
      if (error.status === 401) {
        console.error('🔐 401 Unauthorized - Token pode ser inválido ou expirado');
        // Opcional: limpar token inválido
        // authService.cleanUpAuth();
      }
      
      return throwError(() => error);
    })
  );
};
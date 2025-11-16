import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

// Define a função CanActivate
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true; // Permite acesso à rota
  } else {
    // Redireciona para a tela de login e salva a URL de destino
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false; // Bloqueia acesso à rota
  }
};
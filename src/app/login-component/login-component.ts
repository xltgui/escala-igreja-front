import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-login-component',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  isLoading: boolean = false;
  isPasswordVisible: boolean = false; // Para o ícone de 'olho'

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    // Se o usuário já estiver logado, redireciona para a página principal
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/criacao-missa']); 
    }
  }

  // Configura o formulário com os controles
  initializeForm(): void {
    this.loginForm = this.fb.group({
      // Usamos 'username' para mapear com o campo esperado pelo backend Spring Security
      username: ['', [Validators.required]], 
      password: ['', Validators.required]
    });
  }

  // Alterna a visibilidade da senha (para o ícone de olho)
  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  // Método chamado ao submeter o formulário
  onSubmit(): void {
    this.errorMessage = null;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { username, password } = this.loginForm.value;
    
    // 1. Chama o serviço de autenticação
    this.authService.login({ username, password }).subscribe({
      next: (response) => {
        // 2. Login bem-sucedido: Redireciona
        this.isLoading = false;
        console.log('Login bem-sucedido. Token recebido:', response.token);
        this.router.navigate(['/criacao-missa']); 
      },
      error: (error) => {
        // 3. Login falhou: Exibe erro
        this.isLoading = false;
        this.loginForm.get('password')?.reset(); // Limpa a senha por segurança
        
        if (error.status === 401 || error.status === 403) {
            this.errorMessage = 'Credenciais inválidas. Verifique seu email e senha.';
        } else {
            this.errorMessage = 'Erro de conexão. Tente novamente mais tarde.';
        }
        console.error('Falha no Login:', error);
      }
    });
  }

  // Getter para facilitar o acesso aos controles do formulário no template
  get f() { return this.loginForm.controls; }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Necessário para navegação
import { AuthService } from '../services/auth-service';
import { ScheduleRowDto } from '../criacao-missa-component/schedule-model';
import { ScheduleService } from '../services/schedule-service';

interface EscalaItem {
  data: string;
  hora: string;
  coroinha1: string;
  coroinha2: string;
  vela1: string;
  missal: string;
  turibulo: string;
  naveta: string;
}


@Component({
  selector: 'app-gerenciamento-escala-component',
  imports: [
    CommonModule
  ],
  templateUrl: './gerenciamento-escala-component.html',
  styleUrl: './gerenciamento-escala-component.scss'
})
export class GerenciamentoEscalaComponent implements OnInit {
  escalaMensal: EscalaItem[] = [];
  schedules: ScheduleRowDto[] = [];


  constructor(
    private router: Router,
    private authService: AuthService,
    private scheduleService: ScheduleService
    // private escalaService: EscalaService
  ) { }

  ngOnInit(): void {
    console.log('🔧 GerenciamentoEscalaComponent - ngOnInit chamado');
    console.log('🔧 Usuário é admin?', this.isAdmin());
    this.carregarEscala();
  }

  // ============== Lógica de Dados ==============

  carregarEscala(): void {
    console.log('🔧 carregarEscala() chamado');
    // Simulação: buscar dados da escala (substituir por chamada HTTP real)
      this.scheduleService.list().subscribe({
      next: (schedules) => {
        console.log('✅ Dados recebidos da API:', schedules);
        console.log('✅ Quantidade de schedules:', schedules.length);
        this.schedules = schedules;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar escala:', error);
        console.error('❌ Detalhes do erro:', error.message);
      }
    });
    
  }

  // ============== Lógica de Ações ==============

  // Redireciona para a tela de criação/edição de missa
  editarEscala(): void {
    this.router.navigate(['/criacao-missa']);
  }

  isAdmin(): boolean {
    return this.authService.hasRole('ADMIN')
  }


  // Método para extrair coroinhas (máximo 4)
  getCoroinhas(assignments: any): string[] {
    const coroinhas = [];
    for (const [name, role] of Object.entries(assignments)) {
      if (role === 'COROINHA' && coroinhas.length < 4) {
        coroinhas.push(name);
      }
    }
    return coroinhas;
  }

  // Método para extrair velas (máximo 2)
  getVelas(assignments: any): string[] {
    const velas = [];
    for (const [name, role] of Object.entries(assignments)) {
      if (role === 'VELA' && velas.length < 2) {
        velas.push(name);
      }
    }
    return velas;
  }

  // Método para extrair outras funções específicas
  getByRole(assignments: any, roleName: string): string {
    for (const [name, role] of Object.entries(assignments)) {
      if (role === roleName) {
        return name;
      }
    }
    return '-';
  }

}

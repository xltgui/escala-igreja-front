import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Necessário para navegação

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

  constructor(
    private router: Router
    // private escalaService: EscalaService
  ) { }

  ngOnInit(): void {
    this.carregarEscala();
  }

  // ============== Lógica de Dados ==============

  carregarEscala(): void {
    // Simulação: buscar dados da escala (substituir por chamada HTTP real)
    this.escalaMensal = [
      { data: '01/08/2025', hora: '19:30', coroinha1: 'Lucas Felipe', coroinha2: 'Pedro', vela1: 'Lucas Felipe', missal: 'Pedro', turibulo: 'Lucas Felipe', naveta: 'Pedro' },
      { data: '01/08/2025', hora: '19:00', coroinha1: 'João Palhano', coroinha2: 'Mario', vela1: 'João Palhano', missal: 'Mario', turibulo: 'João Palhano', naveta: 'Mario' },
      // ... mais itens da escala
    ];
    console.log('Escala carregada.');
  }

  // ============== Lógica de Ações ==============

  // Redireciona para a tela de criação/edição de missa
  editarEscala(): void {
    this.router.navigate(['/criacao-missa']);
  }

}

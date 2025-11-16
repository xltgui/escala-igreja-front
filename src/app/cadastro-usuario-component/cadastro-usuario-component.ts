import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LiturgicalServerService } from './liturgical-server-service';
import { LiturgicalServerRequest, LiturgicalServerResponse, LiturgicalServersRole } from './liturgical-server-model';

@Component({
  selector: 'app-cadastro-usuario-component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TitleCasePipe,
    FormsModule
  ],
  templateUrl: './cadastro-usuario-component.html',
  styleUrl: './cadastro-usuario-component.scss'
})
export class CadastroUsuarioComponent implements OnInit {
  usuarioForm!: FormGroup;
  isEditing: boolean = false;
  editingServerId: number | null = null;
  
  // Dados da Tabela
  listaServers: LiturgicalServerResponse[] = [];
  serversFiltrados: LiturgicalServerResponse[] = [];

  // Filtros
  searchTerm: string = '';
  filterType: string = 'todos';

  constructor(
    private fb: FormBuilder,
    private liturgicalServerService: LiturgicalServerService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.carregarServers();
  }

  initializeForm(): void {
    this.usuarioForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      age: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      role: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    const serverData: LiturgicalServerRequest = this.usuarioForm.value;

    if (this.isEditing && this.editingServerId) {
      this.atualizarServer(this.editingServerId, serverData);
    } else {
      this.cadastrarServer(serverData);
    }
  }
  
  cadastrarServer(data: LiturgicalServerRequest): void {
    this.liturgicalServerService.create(data).subscribe({
      next: (response) => {
        console.log('Servidor cadastrado com sucesso:', response);
        this.limparFormulario();
        this.carregarServers();
        //alert('Servidor cadastrado com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao cadastrar servidor:', error);
        //alert('Erro ao cadastrar servidor. Verifique o console para mais detalhes.');
      }
    });
  }

  atualizarServer(id: number, data: LiturgicalServerRequest): void {
    this.liturgicalServerService.update(id, data).subscribe({
      next: () => {
        console.log('Servidor atualizado com sucesso');
        this.limparFormulario();
        this.carregarServers();
        //alert('Servidor atualizado com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao atualizar servidor:', error);
        alert('Erro ao atualizar servidor. Verifique o console para mais detalhes.');
      }
    });
  }

  carregarServers(): void {
    this.liturgicalServerService.list().subscribe({
      next: (servers) => {
        this.listaServers = servers;
        this.filtrarServers();
      },
      error: (error) => {
        console.error('Erro ao carregar servidores:', error);
        //alert('Erro ao carregar servidores. Verifique o console para mais detalhes.');
      }
    });
  }

  editarServer(server: LiturgicalServerResponse): void {
    this.isEditing = true;
    this.editingServerId = server.id;
    
    this.usuarioForm.patchValue({
      name: server.name,
      age: server.age,
      role: server.role
    });
    
    document.getElementById('btnCancelar')?.style.setProperty('display', 'inline-block');
    window.scrollTo(0, 0); 
  }

  excluirServer(server: LiturgicalServerResponse): void {
    if (confirm(`Tem certeza que deseja excluir o servidor ${server.name}?`)) {
      // Note: Você precisaria implementar o método delete no service e controller
      console.log('Excluindo servidor:', server.id);
      alert('Funcionalidade de exclusão não implementada no backend.');
    }
  }

  cancelarEdicao(): void {
    this.limparFormulario();
  }

  limparFormulario(): void {
    this.isEditing = false;
    this.editingServerId = null;
    this.usuarioForm.reset();
    document.getElementById('btnCancelar')?.style.setProperty('display', 'none');
  }

  // Filtro na Tabela
  filtrarServers(): void {
    let temp = this.listaServers;

    // Filtro por tipo
    if (this.filterType !== 'todos') {
      temp = temp.filter(s => s.role === this.filterType.toUpperCase() as LiturgicalServersRole);
    }

    // Filtro por termo de busca
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      temp = temp.filter(s => 
        s.name.toLowerCase().includes(term)
      );
    }
    
    this.serversFiltrados = temp;
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.filtrarServers();
  }

  onFilterChange(type: string): void {
    this.filterType = type;
    this.filtrarServers();
  }

  // Método auxiliar para traduzir os roles para português
  traduzirRole(role: LiturgicalServersRole): string {
    const traducoes: { [key: string]: string } = {
      'ACOLYTE': 'Acólito',
      'ALTAR_SERVER': 'Coroinha'
    };
    return traducoes[role] || role;
  }

  // Método para obter o texto do botão baseado no modo
  getBotaoTexto(): string {
    return this.isEditing ? 'Atualizar Servidor' : 'Cadastrar Servidor';
  }

  // Método para obter o título do formulário
  getTituloFormulario(): string {
    return this.isEditing ? 'Editar Servidor Litúrgico' : 'Cadastro de Servidor Litúrgico';
  }
}
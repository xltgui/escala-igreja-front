import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { 
  ScheduleCreationRequest, 
  ScheduleAssignmentRequest, 
  LiturgicalServersDuty,
  ItemEscala,
  ScheduleRowDto,
  Missa 
} from './schedule-model'
import { ScheduleService } from '../services/schedule-service';
import { LiturgicalServerService } from '../cadastro-usuario-component/liturgical-server-service';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-criacao-missa-component',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './criacao-missa-component.html',
  styleUrl: './criacao-missa-component.scss'
})
export class CriacaoMissaComponent implements OnInit {
  missaIndividualForm!: FormGroup;
  missaBlocoForm!: FormGroup;
  
  // Variáveis de Estado
  currentMode: 'individual' | 'bloco' = 'individual';
  showSelection: boolean = true;

  // Listas de Dados
  coroinhasAcolitos: ItemEscala[] = [];
  coroinhas: ItemEscala[] = [];
  acolitos: ItemEscala[] = [];
  historicoMissas: ScheduleRowDto[] = [];
  previewMissas: Missa[] = [];
  
  meses = [
    { value: 0, label: 'Janeiro' }, { value: 1, label: 'Fevereiro' },
    { value: 2, label: 'Março' }, { value: 3, label: 'Abril' },
    { value: 4, label: 'Maio' }, { value: 5, label: 'Junho' },
    { value: 6, label: 'Julho' }, { value: 7, label: 'Agosto' },
    { value: 8, label: 'Setembro' }, { value: 9, label: 'Outubro' },
    { value: 10, label: 'Novembro' }, { value: 11, label: 'Dezembro' }
  ];

  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService,
    private liturgicalServerService: LiturgicalServerService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.initializeForms();
    this.loadEscalaItems();
    this.carregarHistoricoMissas();
  }


  isAdmin(): boolean {
    return this.authService.hasRole('ADMIN')
  }


  // ============== Inicialização ==============

  initializeForms(): void {
    // Form Individual
    this.missaIndividualForm = this.fb.group({
      dataMissa: ['', Validators.required],
      horarioMissa: ['', Validators.required],
      coroinha1: [''], coroinha2: [''], coroinha3: [''], coroinha4: [''],
      vela1: [''], vela2: [''], missal: [''], turibulo: [''], naveta: ['']
    });

    // Form Bloco
    this.missaBlocoForm = this.fb.group({
      mesSelecionado: ['', Validators.required],
      anoSelecionado: [new Date().getFullYear(), Validators.required],
      tipoMissas: ['domingo', Validators.required],
      coroinhaPadrao1: [''], coroinhaPadrao2: [''],
      coroinhaPadrao3: [''], coroinhaPadrao4: [''],
      velaPadrao1: [''], velaPadrao2: [''],
      missalPadrao: [''], turibuloPadrao: [''], navetaPadrao: ['']
    });
  }

  // ============== Carregamento de Dados ==============

  loadEscalaItems(): void {
    this.liturgicalServerService.getServersAsItems().subscribe({
      next: (servers) => {
        this.coroinhasAcolitos = servers;
        this.coroinhas = servers.filter(s => s.role === 'ALTAR_SERVER');
        this.acolitos = servers.filter(s => s.role === 'ACOLYTE');
        console.log('Servidores carregados:', this.coroinhasAcolitos);
      },
      error: (error) => {
        console.error('Erro ao carregar servidores:', error);
      }
    });
  }

  carregarHistoricoMissas(): void {
    this.scheduleService.list().subscribe({
      next: (missas) => {
        this.historicoMissas = missas;
        console.log('Histórico carregado:', this.historicoMissas);
      },
      error: (error) => {
        console.error('Erro ao carregar histórico:', error);
      }
    });
  }

  // ============== Lógica de Interface ==============

  alternarModo(mode: 'individual' | 'bloco'): void {
    this.currentMode = mode;
    this.showSelection = false;
  }
  
  voltarParaSelecao(): void {
    this.showSelection = true;
    this.missaIndividualForm.reset();
    this.missaBlocoForm.reset({ 
      anoSelecionado: new Date().getFullYear(), 
      tipoMissas: 'domingo' 
    });
    this.previewMissas = [];
  }

  // ============== Criação de Missas ==============

  criarMissaIndividual(): void {
    console.log("INICIO CRIAÇAO MISSA");
    console.log("Form válido?", this.missaIndividualForm.valid);
    console.log("Form errors:", this.missaIndividualForm.errors);
    console.log("Form values:", this.missaIndividualForm.value);
    if (this.missaIndividualForm.valid) {
      const formValue = this.missaIndividualForm.value;
      
      // Converte o formulário para ScheduleCreationRequest
      const scheduleRequest: ScheduleCreationRequest = {
        date: formValue.dataMissa,
        time: formValue.horarioMissa,
        assignments: this.buildAssignmentsFromForm(formValue)
      };

      console.log('Criando Missa Individual:', scheduleRequest);
      
      this.scheduleService.create(scheduleRequest).subscribe({
        next: () => {
          console.log('Missa criada com sucesso!');
          this.missaIndividualForm.reset();
          this.carregarHistoricoMissas();
          alert('Missa criada com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao criar missa:', error);
          alert('Erro ao criar missa. Verifique o console.');
        }
      });
    } else {
      this.missaIndividualForm.markAllAsTouched();
    }
  }

  // Converte os selects do formulário para assignments
  private buildAssignmentsFromForm(formValue: any): ScheduleAssignmentRequest[] {
    const assignments: ScheduleAssignmentRequest[] = [];

    // Coroinhas (ACOLYTE)
    if (formValue.coroinha1) assignments.push({ serverId: +formValue.coroinha1, duty: LiturgicalServersDuty.COROINHA });
    if (formValue.coroinha2) assignments.push({ serverId: +formValue.coroinha2, duty: LiturgicalServersDuty.COROINHA });
    if (formValue.coroinha3) assignments.push({ serverId: +formValue.coroinha3, duty: LiturgicalServersDuty.COROINHA });
    if (formValue.coroinha4) assignments.push({ serverId: +formValue.coroinha4, duty: LiturgicalServersDuty.COROINHA });

    // Velas (CANDLE_BEARER)
    if (formValue.vela1) assignments.push({ serverId: +formValue.vela1, duty: LiturgicalServersDuty.VELA });
    if (formValue.vela2) assignments.push({ serverId: +formValue.vela2, duty: LiturgicalServersDuty.VELA, });

    // Missal (BOOK_BEARER)
    if (formValue.missal) assignments.push({ serverId: +formValue.missal, duty: LiturgicalServersDuty.MISSAL });

    // Turíbulo (THURIBLE_BEARER)
    if (formValue.turibulo) assignments.push({ serverId: +formValue.turibulo, duty: LiturgicalServersDuty.TURIBULO });

    // Naveta (BOAT_BEARER)
    if (formValue.naveta) assignments.push({ serverId: +formValue.naveta, duty: LiturgicalServersDuty.NAVETA });

    return assignments;
  }

  // ============== Criação em Bloco ==============

  gerarPreviewMissas(): void {
    if (this.missaBlocoForm.invalid) {
      this.missaBlocoForm.markAllAsTouched();
      return;
    }

    const formValue = this.missaBlocoForm.value;
    console.log('Gerando preview para:', formValue);
    
    // Lógica simplificada para gerar preview
    // Aqui você implementaria a geração de datas baseada no mês/ano/tipo
    this.previewMissas = this.gerarDatasParaMes(
      formValue.mesSelecionado, 
      formValue.anoSelecionado, 
      formValue.tipoMissas
    );
  }

  private gerarDatasParaMes(mes: number, ano: number, tipo: string): Missa[] {
    // Implementação simplificada - gere as datas baseadas no tipo
    const missas: Missa[] = [];
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();

    for (let dia = 1; dia <= diasNoMes; dia++) {
      const data = new Date(ano, mes, dia);
      
      // Filtra por tipo de missa
      if (this.deveIncluirDia(data, tipo)) {
        missas.push({
          data: data.toISOString().split('T')[0],
          horario: '19:00', // Horário padrão
          assignments: this.buildAssignmentsFromForm(this.missaBlocoForm.value)
        });
      }
    }

    return missas;
  }

  private deveIncluirDia(data: Date, tipo: string): boolean {
    const diaSemana = data.getDay();
    
    switch (tipo) {
      case 'domingo': return diaSemana === 0;
      case 'sabado_domingo': return diaSemana === 0 || diaSemana === 6;
      case 'todos_dias': return true;
      default: return false;
    }
  }

  criarMissasEmBloco(): void {
    if (this.missaBlocoForm.valid && this.previewMissas.length > 0) {
      const formValue = this.missaBlocoForm.value;
      const yearMonth = `${formValue.anoSelecionado}-${String(formValue.mesSelecionado + 1).padStart(2, '0')}`;
      
      // Converte para ScheduleCreationRequest
      const scheduleRequests: ScheduleCreationRequest[] = this.previewMissas.map(missa => ({
        date: missa.data,
        time: missa.horario,
        assignments: this.buildAssignmentsFromForm(formValue)
      }));

      console.log('Criando Missas em Bloco:', scheduleRequests);
      
      this.scheduleService.createMonthly(yearMonth, scheduleRequests).subscribe({
        next: () => {
          console.log('Missas em bloco criadas com sucesso!');
          this.missaBlocoForm.reset();
          this.previewMissas = [];
          this.carregarHistoricoMissas();
          alert('Missas em bloco criadas com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao criar missas em bloco:', error);
          alert('Erro ao criar missas em bloco. Verifique o console.');
        }
      });
    } else {
      alert('Gere o preview primeiro ou preencha todos os campos.');
    }
  }

  // ============== Gerenciamento do Histórico ==============

  removerTodasMissas(): void {
    if (confirm('ATENÇÃO: Isso removerá TODAS as missas do histórico. Continuar?')) {
      this.scheduleService.deleteAll().subscribe({
        next: () => {
          console.log('Todas as missas removidas');
          this.historicoMissas = [];
          alert('Todas as missas foram removidas.');
        },
        error: (error) => {
          console.error('Erro ao remover missas:', error);
          alert('Erro ao remover missas. Verifique o console.');
        }
      });
    }
  }

  // Método auxiliar para formatar exibição
  formatarAssignments(assignments: { [key: string]: string }): string {
    return Object.entries(assignments)
      .map(([nome, funcao]) => `${nome} (${funcao})`)
      .join(', ');
  }

  // Método para calcular o rowspan baseado no número de assignments
getRowspan(assignments: { [key: string]: string }): number {
  return Object.keys(assignments || {}).length;
}

// Método para formatar a data
formatarData(data: string): string {
  if (!data) return '';
  return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
}

// Método para formatar o horário
formatarHorario(horario: string): string {
  if (!horario) return '';
  // Remove segundos se existirem
  return horario.split(':').slice(0, 2).join(':');
}

// Método para traduzir os dias
traduzirDia(dia: string): string {
  const traducoes: { [key: string]: string } = {
    'SUNDAY': 'Domingo',
    'MONDAY': 'Segunda',
    'TUESDAY': 'Terça', 
    'WEDNESDAY': 'Quarta',
    'THURSDAY': 'Quinta',
    'FRIDAY': 'Sexta',
    'SATURDAY': 'Sábado',
    'DOMINGO': 'Domingo',
    'SEGUNDA': 'Segunda',
    'TERÇA': 'Terça',
    'QUARTA': 'Quarta', 
    'QUINTA': 'Quinta',
    'SEXTA': 'Sexta',
    'SÁBADO': 'Sábado'
  };
  return traducoes[dia] || dia;
}

// Método para traduzir as funções
traduzirFuncao(funcao: string): string {
  const traducoes: { [key: string]: string } = {
    'MISSAL': 'Missal',
    'TURIBULO': 'Turíbulo',
    'VELA': 'Vela',
    'NAVETA': 'Naveta',
    'COROINHA': 'Coroinha'
  };
  return traducoes[funcao] || funcao;
}
}
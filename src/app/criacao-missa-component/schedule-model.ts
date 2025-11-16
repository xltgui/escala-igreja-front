export interface ScheduleCreationRequest {
  date: string; // LocalDate no formato "YYYY-MM-DD"
  time: string; // LocalTime no formato "HH:mm"
  assignments: ScheduleAssignmentRequest[];
}

export interface ScheduleAssignmentRequest {
  serverId: number;
  duty: LiturgicalServersDuty;
}

export interface ScheduleRowDto {
  id: number;
  day: string;
  monthPt: string;
  date: string;
  time: string;
  assignments: { [key: string]: string }; // Map<String, String>
}

export interface ScheduleRequestParams {
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
}

// Enums correspondentes ao backend
export enum LiturgicalServersDuty {
  VELA = 'VELA',
  MISSAL = 'MISSAL',
  TURIBULO = 'TURIBULO',
  NAVETA = 'NAVETA',
  COROINHA = 'COROINHA'
}

export enum WeekDay {
  SUNDAY = 'DOMINGO',
  MONDAY = 'SEGUNDA',
  TUESDAY = 'TERÇA',
  WEDNESDAY = 'QUARTA',
  THURSDAY = 'QUINTA',
  FRIDAY = 'SEXTA',
  SATURDAY = 'SÁBADO'
}

export enum MonthPt {
  JANUARY = 'JANEIRO',
  FEBRUARY = 'FEVEREIRO',
  MARCH = 'MARÇO',
  APRIL = 'ABRIL',
  MAY = 'MAIO',
  JUNE = 'JUNHO',
  JULY = 'JULHO',
  AUGUST = 'AGOSTO',
  SEPTEMBER = 'SETEMBRO',
  OCTOBER = 'OUTUBRO',
  NOVEMBER = 'NOVEMBRO',
  DECEMBER = 'DEZEMBRO'
}

// Interface para o frontend (mais simples)
export interface Missa {
  id?: number;
  data: string;
  horario: string;
  assignments: ScheduleAssignmentRequest[];
}

export interface ItemEscala {
  id: number;
  name: string;
  role: string;
}
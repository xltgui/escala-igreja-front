import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  ScheduleCreationRequest, 
  ScheduleRowDto, 
  ScheduleRequestParams,
  Missa 
} from '../criacao-missa-component/schedule-model'

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private baseUrl = 'http://localhost:8080/schedule';

  constructor(private http: HttpClient) { }

  // Cria uma missa individual
  create(schedule: ScheduleCreationRequest): Observable<void> {
    return this.http.post<void>(this.baseUrl, schedule);
  }

  // Cria missas mensais em lote
  createMonthly(yearMonth: string, schedules: ScheduleCreationRequest[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/monthly/${yearMonth}`, schedules);
  }

  // Lista missas com filtros
  list(params?: ScheduleRequestParams): Observable<ScheduleRowDto[]> {
    let httpParams = new HttpParams();
    
    if (params?.startDate) httpParams = httpParams.set('startDate', params.startDate);
    if (params?.endDate) httpParams = httpParams.set('endDate', params.endDate);
    if (params?.startTime) httpParams = httpParams.set('startTime', params.startTime);
    if (params?.endTime) httpParams = httpParams.set('endTime', params.endTime);

    return this.http.get<ScheduleRowDto[]>(this.baseUrl, { 
      params: httpParams 
    });
  }

  // Busca missa por ID
  findById(id: number): Observable<ScheduleRowDto> {
    return this.http.get<ScheduleRowDto>(`${this.baseUrl}/${id}`);
  }

  // Atualiza missa
  update(id: number, schedule: ScheduleCreationRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, schedule);
  }

  // Deleta missa
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Deleta todas as missas (método auxiliar)
  deleteAll(): Observable<void> {
    // Nota: Você precisaria implementar este endpoint no backend
    // Por enquanto, vamos deletar uma por uma baseado na lista
    return new Observable(observer => {
      this.list().subscribe(missas => {
        const deleteObservables = missas.map(missa => 
          this.delete(missa.id)
        );
        
        // Executa todas as deleções
        Promise.all(deleteObservables.map(obs => obs.toPromise()))
          .then(() => {
            observer.next();
            observer.complete();
          })
          .catch(error => observer.error(error));
      });
    });
  }
}

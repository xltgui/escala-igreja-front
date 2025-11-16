import { Injectable } from '@angular/core';
import { LiturgicalServerRequest, LiturgicalServerResponse } from './liturgical-server-model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { ItemEscala } from '../criacao-missa-component/schedule-model';

@Injectable({
  providedIn: 'root'
})
export class LiturgicalServerService {
  // URL base do endpoint, correspondente ao @RequestMapping("/liturgical-servers")
  private apiUrl = 'http://localhost:8080/liturgical-servers'; // Ajuste a porta se necessário

  constructor(private http: HttpClient) { }
  /**
   * Endpoint: POST /liturgical-servers
   * Cria um novo servidor litúrgico (usuário).
   */
  create(request: LiturgicalServerRequest): Observable<LiturgicalServerResponse> {
    return this.http.post<LiturgicalServerResponse>(this.apiUrl, request);
  }

  /**
   * Endpoint: GET /liturgical-servers
   * Lista todos os servidores litúrgicos.
   */
  list(): Observable<LiturgicalServerResponse[]> {
    return this.http.get<LiturgicalServerResponse[]>(this.apiUrl);
  }

  /**
   * Endpoint: PUT /liturgical-servers/{id}
   * Atualiza um servidor litúrgico existente.
   * @param id O ID do servidor a ser atualizado (parte do path).
   * @param request O corpo da requisição com os dados atualizados.
   */
  update(id: number, request: LiturgicalServerRequest): Observable<any> {
    // O backend Spring espera que o ID esteja na requisição para a lógica de update
    // Como o DTO de requisição (LiturgicalServerRequest) do backend não tem ID, 
    // a requisição Angular precisa incluir o ID no path.
    // O service do Spring (LiturgicalServerService.update) verifica o ID.
    
    // ATENÇÃO: O DTO LiturgicalServerRequest do backend não possui ID. 
    // Se o backend precisa do ID para o update:
    // 1. Ou você envia o ID no corpo e mapeia no backend.
    // 2. Ou cria um DTO de Update no backend que inclua o ID.
    // Usando o DTO atual, assumimos que o ID é enviado no path:
    
    // O backend retorna ResponseEntity.noContent().build(), então esperamos um 204 sem corpo.
    return this.http.put(`${this.apiUrl}/${id}`, { ...request, id: id }); 
    // Nota: O backend pode esperar que você envie o objeto 'LiturgicalServer' com ID.
    // Fazemos um PUT para o path e enviamos o corpo LiturgicalServerRequest.
    // Assumimos que o Spring consegue mapear isso.
    
    // Se você tiver problemas, verifique se o DTO de requisição do update no backend
    // é adequado para receber o ID do servidor.
  }

  // Novo método para converter servidores em ItemEscala
  getServersAsItems(): Observable<ItemEscala[]> {
    return new Observable(observer => {
      this.list().subscribe(servers => {
        const items: ItemEscala[] = servers.map(server => ({
          id: server.id,
          name: server.name,
          role: server.role
        }));
        observer.next(items);
        observer.complete();
      }, error => observer.error(error));
    });
  }
}

export type LiturgicalServersRole = 'ACOLYTE' | 'ALTAR_SERVER';

// Interface para o corpo da requisição (LiturgicalServerRequest)
export interface LiturgicalServerRequest {
  name: string;
  age: number;
  role: LiturgicalServersRole;
}

// Interface para a resposta do servidor (LiturgicalServerResponse)
export interface LiturgicalServerResponse {
  id: number;
  name: string;
  age: number;
  role: LiturgicalServersRole;
}
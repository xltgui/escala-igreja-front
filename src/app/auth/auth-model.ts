export interface LoginRequest {
  username: string;
  password: string;
}

// Resposta esperada após login bem-sucedido (contendo o token)
export interface LoginResponse {
  token: string;
  userId: number;
  loggedUser: LoggedUser
}

export interface LoggedUser{
    username: string;
    roles: string[];
}
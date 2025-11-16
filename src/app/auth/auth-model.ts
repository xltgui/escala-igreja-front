export interface LoginRequest {
  username: string;
  password: string;
}

// Resposta esperada após login bem-sucedido (contendo o token)
export interface LoginResponse {
  token: string;
  userId: number;
  roles: string[]; // Ex: ['ADMIN', 'ACOLITO']
  // ... outros dados úteis
}
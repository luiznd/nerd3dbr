// Modelo de domínio para Usuário
export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Armazenado com hash
  role: 'customer' | 'admin';
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
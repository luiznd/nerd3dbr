// Modelo de domínio para Produto
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  tags: string[];
  inStock: number;
  isDigital: boolean;
  fileUrl?: string; // Para produtos digitais
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  }; // Para produtos físicos
  weight?: number; // Para produtos físicos
  createdAt: Date;
  updatedAt: Date;
}
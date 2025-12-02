// Implementação da API de produtos (camada de infraestrutura)
import { Product } from '../../domain/models/Product';
import { ProductRepository } from '../../domain/interfaces/ProductRepository';

// Implementação concreta do repositório de produtos usando API
export class ProductApiRepository implements ProductRepository {
  private apiUrl: string;

  constructor(apiUrl: string = 'https://api.nerd3dbr.com/products') {
    this.apiUrl = apiUrl;
  }

  async findAll(): Promise<Product[]> {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error('Falha ao buscar produtos');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }
  }

  async findById(id: string): Promise<Product | null> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Falha ao buscar produto');
      }
      return await response.json();
    } catch (error) {
      console.error(`Erro ao buscar produto ${id}:`, error);
      return null;
    }
  }

  async findByCategory(category: string): Promise<Product[]> {
    try {
      const response = await fetch(`${this.apiUrl}?category=${category}`);
      if (!response.ok) {
        throw new Error('Falha ao buscar produtos por categoria');
      }
      return await response.json();
    } catch (error) {
      console.error(`Erro ao buscar produtos da categoria ${category}:`, error);
      return [];
    }
  }

  async save(product: Product): Promise<Product> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      if (!response.ok) {
        throw new Error('Falha ao salvar produto');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      throw error;
    }
  }

  async update(id: string, product: Partial<Product>): Promise<Product | null> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Falha ao atualizar produto');
      }
      return await response.json();
    } catch (error) {
      console.error(`Erro ao atualizar produto ${id}:`, error);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.error(`Erro ao excluir produto ${id}:`, error);
      return false;
    }
  }
}
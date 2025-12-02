// Serviço de aplicação para produtos seguindo o princípio de Responsabilidade Única (SRP)
import { Product } from '../../domain/models/Product';
import { ProductRepository } from '../../domain/interfaces/ProductRepository';

export class ProductService {
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.productRepository.findByCategory(category);
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return this.productRepository.save(newProduct);
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product | null> {
    const updatedProduct = {
      ...product,
      updatedAt: new Date()
    };
    return this.productRepository.update(id, updatedProduct);
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.productRepository.delete(id);
  }
}
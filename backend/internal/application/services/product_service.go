package services

import (
	"context"
	"time"

	"github.com/nerd3dbr/backend/internal/domain/interfaces"
	"github.com/nerd3dbr/backend/internal/domain/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// ProductService implementa a lógica de negócios para produtos
type ProductService struct {
	productRepo interfaces.ProductRepository
}

// NewProductService cria uma nova instância de ProductService
func NewProductService(repo interfaces.ProductRepository) *ProductService {
	return &ProductService{
		productRepo: repo,
	}
}

// GetAllProducts retorna todos os produtos
func (s *ProductService) GetAllProducts(ctx context.Context) ([]models.Product, error) {
	return s.productRepo.FindAll(ctx)
}

// GetProductByID retorna um produto pelo ID
func (s *ProductService) GetProductByID(ctx context.Context, id string) (*models.Product, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	return s.productRepo.FindByID(ctx, objectID)
}

// GetProductsByCategory retorna produtos por categoria
func (s *ProductService) GetProductsByCategory(ctx context.Context, category string) ([]models.Product, error) {
	return s.productRepo.FindByCategory(ctx, category)
}

// CreateProduct cria um novo produto
func (s *ProductService) CreateProduct(ctx context.Context, product *models.Product) (*models.Product, error) {
	product.ID = primitive.NewObjectID()
	product.CreatedAt = time.Now()
	product.UpdatedAt = time.Now()
	return s.productRepo.Save(ctx, product)
}

// UpdateProduct atualiza um produto existente
func (s *ProductService) UpdateProduct(ctx context.Context, id string, product *models.Product) (*models.Product, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	product.UpdatedAt = time.Now()
	return s.productRepo.Update(ctx, objectID, product)
}

// DeleteProduct remove um produto
func (s *ProductService) DeleteProduct(ctx context.Context, id string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	return s.productRepo.Delete(ctx, objectID)
}
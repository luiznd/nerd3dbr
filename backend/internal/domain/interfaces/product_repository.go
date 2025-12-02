package interfaces

import (
	"context"

	"github.com/nerd3dbr/backend/internal/domain/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// ProductRepository define a interface para operações de repositório de produtos
type ProductRepository interface {
	FindAll(ctx context.Context) ([]models.Product, error)
	FindByID(ctx context.Context, id primitive.ObjectID) (*models.Product, error)
	FindByCategory(ctx context.Context, category string) ([]models.Product, error)
	Save(ctx context.Context, product *models.Product) (*models.Product, error)
	Update(ctx context.Context, id primitive.ObjectID, product *models.Product) (*models.Product, error)
	Delete(ctx context.Context, id primitive.ObjectID) error
}
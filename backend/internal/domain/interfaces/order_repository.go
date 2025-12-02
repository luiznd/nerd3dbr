package interfaces

import (
	"context"

	"github.com/nerd3dbr/backend/internal/domain/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// OrderRepository define a interface para o repositório de pedidos
type OrderRepository interface {
	Create(ctx context.Context, order *models.Order) (*models.Order, error)
	FindByID(ctx context.Context, id primitive.ObjectID) (*models.Order, error)
	FindByUser(ctx context.Context, userID primitive.ObjectID) ([]*models.Order, error)
	UpdateStatus(ctx context.Context, id primitive.ObjectID, status string) error
}

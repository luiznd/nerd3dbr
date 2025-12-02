package interfaces

import (
	"context"

	"github.com/nerd3dbr/backend/internal/domain/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// UserRepository define as operações para persistência de usuários
type UserRepository interface {
	FindByID(ctx context.Context, id primitive.ObjectID) (*models.User, error)
	FindByEmail(ctx context.Context, email string) (*models.User, error)
	Create(ctx context.Context, user *models.User) error
	Update(ctx context.Context, user *models.User) error
	Delete(ctx context.Context, id primitive.ObjectID) error
}

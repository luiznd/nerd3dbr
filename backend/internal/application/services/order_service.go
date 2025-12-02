package services

import (
	"context"

	"github.com/nerd3dbr/backend/internal/domain/interfaces"
	"github.com/nerd3dbr/backend/internal/domain/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// OrderService gerencia a lógica de negócios para pedidos
type OrderService struct {
	orderRepo interfaces.OrderRepository
}

// NewOrderService cria uma nova instância de OrderService
func NewOrderService(repo interfaces.OrderRepository) *OrderService {
	return &OrderService{
		orderRepo: repo,
	}
}

// CreateOrder cria um novo pedido
func (s *OrderService) CreateOrder(ctx context.Context, order *models.Order) (*models.Order, error) {
	return s.orderRepo.Create(ctx, order)
}

// GetOrderByID busca um pedido pelo ID
func (s *OrderService) GetOrderByID(ctx context.Context, id primitive.ObjectID) (*models.Order, error) {
	return s.orderRepo.FindByID(ctx, id)
}

// GetOrdersByUserID busca todos os pedidos de um usuário
func (s *OrderService) GetOrdersByUserID(ctx context.Context, userID primitive.ObjectID) ([]*models.Order, error) {
	return s.orderRepo.FindByUser(ctx, userID)
}

// UpdateOrderStatus atualiza o status de um pedido
func (s *OrderService) UpdateOrderStatus(ctx context.Context, id primitive.ObjectID, status string) error {
	return s.orderRepo.UpdateStatus(ctx, id, status)
}

// CancelOrder cancela um pedido
func (s *OrderService) CancelOrder(ctx context.Context, id primitive.ObjectID) error {
	// Lógica de cancelamento, por exemplo, verificar se o pedido pode ser cancelado
	// e então atualizar o status
	return s.orderRepo.UpdateStatus(ctx, id, "cancelled")
}

package repositories

import (
	"context"

	"github.com/nerd3dbr/backend/internal/domain/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// MongoOrderRepository é uma implementação do repositório de pedidos para MongoDB
type MongoOrderRepository struct {
	collection *mongo.Collection
}

// NewMongoOrderRepository cria um novo repositório de pedidos para MongoDB
func NewMongoOrderRepository(db *mongo.Database) *MongoOrderRepository {
	return &MongoOrderRepository{
		collection: db.Collection("orders"),
	}
}

// Create insere um novo pedido no banco de dados
func (r *MongoOrderRepository) Create(ctx context.Context, order *models.Order) (*models.Order, error) {
	order.ID = primitive.NewObjectID()
	_, err := r.collection.InsertOne(ctx, order)
	if err != nil {
		return nil, err
	}
	return order, nil
}

// FindByID busca um pedido pelo seu ID
func (r *MongoOrderRepository) FindByID(ctx context.Context, id primitive.ObjectID) (*models.Order, error) {
	var order models.Order
	err := r.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&order)
	if err != nil {
		return nil, err
	}
	return &order, nil
}

// FindByUser busca todos os pedidos de um usuário
func (r *MongoOrderRepository) FindByUser(ctx context.Context, userID primitive.ObjectID) ([]*models.Order, error) {
	var orders []*models.Order
	cursor, err := r.collection.Find(ctx, bson.M{"userId": userID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	if err = cursor.All(ctx, &orders); err != nil {
		return nil, err
	}

	return orders, nil
}

// UpdateStatus atualiza o status de um pedido
func (r *MongoOrderRepository) UpdateStatus(ctx context.Context, id primitive.ObjectID, status string) error {
	_, err := r.collection.UpdateOne(
		ctx,
		bson.M{"_id": id},
		bson.M{"$set": bson.M{"status": status}},
	)
	return err
}

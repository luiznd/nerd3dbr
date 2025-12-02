package repositories

import (
	"context"

	"github.com/nerd3dbr/backend/internal/domain/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// MongoProductRepository implementa a interface ProductRepository usando MongoDB
type MongoProductRepository struct {
	collection *mongo.Collection
}

// NewMongoProductRepository cria uma nova instância de MongoProductRepository
func NewMongoProductRepository(db *mongo.Database) *MongoProductRepository {
	return &MongoProductRepository{
		collection: db.Collection("products"),
	}
}

// FindAll retorna todos os produtos
func (r *MongoProductRepository) FindAll(ctx context.Context) ([]models.Product, error) {
	cursor, err := r.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var products []models.Product
	if err = cursor.All(ctx, &products); err != nil {
		return nil, err
	}
	return products, nil
}

// FindByID retorna um produto pelo ID
func (r *MongoProductRepository) FindByID(ctx context.Context, id primitive.ObjectID) (*models.Product, error) {
	var product models.Product
	err := r.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&product)
	if err != nil {
		return nil, err
	}
	return &product, nil
}

// FindByCategory retorna produtos por categoria
func (r *MongoProductRepository) FindByCategory(ctx context.Context, category string) ([]models.Product, error) {
	cursor, err := r.collection.Find(ctx, bson.M{"category": category})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var products []models.Product
	if err = cursor.All(ctx, &products); err != nil {
		return nil, err
	}
	return products, nil
}

// Save salva um novo produto
func (r *MongoProductRepository) Save(ctx context.Context, product *models.Product) (*models.Product, error) {
	_, err := r.collection.InsertOne(ctx, product)
	if err != nil {
		return nil, err
	}
	return product, nil
}

// Update atualiza um produto existente
func (r *MongoProductRepository) Update(ctx context.Context, id primitive.ObjectID, product *models.Product) (*models.Product, error) {
	_, err := r.collection.ReplaceOne(ctx, bson.M{"_id": id}, product)
	if err != nil {
		return nil, err
	}
	return product, nil
}

// Delete remove um produto
func (r *MongoProductRepository) Delete(ctx context.Context, id primitive.ObjectID) error {
	_, err := r.collection.DeleteOne(ctx, bson.M{"_id": id})
	return err
}
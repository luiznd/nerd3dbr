package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// OrderItem representa um item dentro de um pedido
type OrderItem struct {
	ProductID primitive.ObjectID `bson:"productId" json:"productId"`
	Quantity  int                `bson:"quantity" json:"quantity"`
	Price     float64            `bson:"price" json:"price"`
}

// Address representa um endereço de entrega ou cobrança
type Address struct {
	Street       string `bson:"street" json:"street"`
	Number       string `bson:"number" json:"number"`
	Complement   string `bson:"complement,omitempty" json:"complement,omitempty"`
	Neighborhood string `bson:"neighborhood" json:"neighborhood"`
	City         string `bson:"city" json:"city"`
	State        string `bson:"state" json:"state"`
	ZipCode      string `bson:"zipCode" json:"zipCode"`
}

// Shipping representa as informações de entrega de um pedido
type Shipping struct {
	Address Address `bson:"address" json:"address"`
	Method  string  `bson:"method" json:"method"`
	Cost    float64 `bson:"cost" json:"cost"`
}

// Order representa um pedido no sistema
type Order struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	UserID    primitive.ObjectID `bson:"userId" json:"userId"`
	Items     []OrderItem        `bson:"items" json:"items"`
	Total     float64            `bson:"total" json:"total"`
	Status    string             `bson:"status" json:"status"`
	Shipping  Shipping           `bson:"shipping" json:"shipping"`
	CreatedAt time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time          `bson:"updatedAt" json:"updatedAt"`
}

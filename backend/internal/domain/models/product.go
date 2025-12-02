package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Product representa o modelo de domínio para produtos
type Product struct {
	ID          primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name        string             `json:"name" bson:"name"`
	Description string             `json:"description" bson:"description"`
	Price       float64            `json:"price" bson:"price"`
	Images      []string           `json:"images" bson:"images"`
	Category    string             `json:"category" bson:"category"`
	Tags        []string           `json:"tags" bson:"tags"`
	InStock     int                `json:"inStock" bson:"in_stock"`
	IsDigital   bool               `json:"isDigital" bson:"is_digital"`
	FileURL     string             `json:"fileUrl,omitempty" bson:"file_url,omitempty"`
	Dimensions  *Dimensions        `json:"dimensions,omitempty" bson:"dimensions,omitempty"`
	Weight      float64            `json:"weight,omitempty" bson:"weight,omitempty"`
	CreatedAt   time.Time          `json:"createdAt" bson:"created_at"`
	UpdatedAt   time.Time          `json:"updatedAt" bson:"updated_at"`
}

// Dimensions representa as dimensões de um produto físico
type Dimensions struct {
	Width  float64 `json:"width" bson:"width"`
	Height float64 `json:"height" bson:"height"`
	Depth  float64 `json:"depth" bson:"depth"`
}
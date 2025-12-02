package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

// User representa um usuário do sistema
type User struct {
	ID             primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Email          string             `bson:"email" json:"email"`
	HashedPassword string             `bson:"hashed_password" json:"-"`
	Name           string             `bson:"name" json:"name"`
	Role           string             `bson:"role" json:"role"`
	CreatedAt      time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt      time.Time          `bson:"updated_at" json:"updated_at"`
}

// NewUser cria um novo usuário com senha criptografada
func NewUser(email, password, name, role string) (*User, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	now := time.Now()
	return &User{
		Email:          email,
		HashedPassword: string(hashedPassword),
		Name:           name,
		Role:           role,
		CreatedAt:      now,
		UpdatedAt:      now,
	}, nil
}

// CheckPassword verifica se a senha fornecida corresponde à senha armazenada
func (u *User) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.HashedPassword), []byte(password))
	return err == nil
}

// UpdatePassword atualiza a senha do usuário
func (u *User) UpdatePassword(password string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.HashedPassword = string(hashedPassword)
	u.UpdatedAt = time.Now()
	return nil
}
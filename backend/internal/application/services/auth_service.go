package services

import (
	"context"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/nerd3dbr/backend/internal/domain/interfaces"
	"github.com/nerd3dbr/backend/internal/domain/models"
)

// AuthService gerencia autenticação e autorização
type AuthService struct {
	userRepo interfaces.UserRepository
	jwtKey   []byte
	jwtExp   time.Duration
}

// TokenClaims representa os claims do JWT
type TokenClaims struct {
	UserID string `json:"user_id"`
	Email  string `json:"email"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

// LoginRequest representa os dados de login
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// RegisterRequest representa os dados de registro
type RegisterRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
}

// AuthResponse representa a resposta de autenticação
type AuthResponse struct {
	Token     string      `json:"token"`
	ExpiresAt time.Time   `json:"expires_at"`
	User      *models.User `json:"user"`
}

// NewAuthService cria um novo serviço de autenticação
func NewAuthService(userRepo interfaces.UserRepository, jwtKey string, jwtExp time.Duration) *AuthService {
	return &AuthService{
		userRepo: userRepo,
		jwtKey:   []byte(jwtKey),
		jwtExp:   jwtExp,
	}
}

// Register registra um novo usuário
func (s *AuthService) Register(ctx context.Context, req RegisterRequest) (*AuthResponse, error) {
	// Verifica se o email já existe
	existingUser, _ := s.userRepo.FindByEmail(ctx, req.Email)
	if existingUser != nil {
		return nil, errors.New("email já está em uso")
	}

	// Cria o novo usuário
	user, err := models.NewUser(req.Email, req.Password, req.Name, "customer")
	if err != nil {
		return nil, err
	}

	// Persiste o usuário
	if err := s.userRepo.Create(ctx, user); err != nil {
		return nil, err
	}

	// Gera o token JWT
	return s.generateToken(user)
}

// Login autentica um usuário
func (s *AuthService) Login(ctx context.Context, req LoginRequest) (*AuthResponse, error) {
	// Busca o usuário pelo email
	user, err := s.userRepo.FindByEmail(ctx, req.Email)
	if err != nil {
		return nil, errors.New("credenciais inválidas")
	}

	// Verifica a senha
	if !user.CheckPassword(req.Password) {
		return nil, errors.New("credenciais inválidas")
	}

	// Gera o token JWT
	return s.generateToken(user)
}

// ValidateToken valida um token JWT
func (s *AuthService) ValidateToken(tokenString string) (*TokenClaims, error) {
	claims := &TokenClaims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return s.jwtKey, nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, errors.New("token inválido")
	}

	return claims, nil
}

// GetUserByID busca um usuário pelo ID
func (s *AuthService) GetUserByID(ctx context.Context, id string) (*models.User, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	return s.userRepo.FindByID(ctx, objectID)
}

// generateToken gera um token JWT para o usuário
func (s *AuthService) generateToken(user *models.User) (*AuthResponse, error) {
	expirationTime := time.Now().Add(s.jwtExp)

	claims := &TokenClaims{
		UserID: user.ID.Hex(),
		Email:  user.Email,
		Role:   user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Issuer:    "nerd3dbr-api",
			Subject:   user.ID.Hex(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(s.jwtKey)
	if err != nil {
		return nil, err
	}

	return &AuthResponse{
		Token:     tokenString,
		ExpiresAt: expirationTime,
		User:      user,
	}, nil
}
package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/nerd3dbr/backend/internal/application/services"
)

// AuthHandler gerencia as requisições de autenticação
type AuthHandler struct {
	authService *services.AuthService
}

// NewAuthHandler cria um novo handler de autenticação
func NewAuthHandler(authService *services.AuthService) *AuthHandler {
	return &AuthHandler{
		authService: authService,
	}
}

// Register registra um novo usuário
func (h *AuthHandler) Register(c *gin.Context) {
	var req services.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "dados inválidos"})
		return
	}

	// Valida os dados
	if req.Email == "" || req.Password == "" || req.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "todos os campos são obrigatórios"})
		return
	}

	// Registra o usuário
	response, err := h.authService.Register(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, response)
}

// Login autentica um usuário
func (h *AuthHandler) Login(c *gin.Context) {
	var req services.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "dados inválidos"})
		return
	}

	// Valida os dados
	if req.Email == "" || req.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "email e senha são obrigatórios"})
		return
	}

	// Autentica o usuário
	response, err := h.authService.Login(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, response)
}

// Me retorna os dados do usuário autenticado
func (h *AuthHandler) Me(c *gin.Context) {
	// Obtém o ID do usuário do contexto (definido pelo middleware de autenticação)
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "usuário não autenticado"})
		return
	}

	// Busca o usuário pelo ID
	user, err := h.authService.GetUserByID(c.Request.Context(), userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "erro ao buscar usuário"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"user": user})
}

// RegisterRoutes registra as rotas de autenticação
func (h *AuthHandler) RegisterRoutes(router *gin.RouterGroup) {
	auth := router.Group("/auth")
	{
		auth.POST("/register", h.Register)
		auth.POST("/login", h.Login)
		auth.GET("/me", h.Me) // Esta rota será protegida pelo middleware de autenticação
	}
}

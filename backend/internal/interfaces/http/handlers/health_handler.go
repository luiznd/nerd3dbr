package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// HealthHandler gerencia as requisições de health check
type HealthHandler struct {}

// NewHealthHandler cria um novo handler de health check
func NewHealthHandler() *HealthHandler {
	return &HealthHandler{}
}

// RegisterRoutes registra as rotas do handler
func (h *HealthHandler) RegisterRoutes(router *gin.RouterGroup) {
	router.GET("/health", h.HealthCheck)
}

// HealthCheck verifica o status do servidor
func (h *HealthHandler) HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status": "ok",
		"timestamp": time.Now().Format(time.RFC3339),
		"service": "Nerd3D-Backend",
		"version": "1.0.0",
	})
}
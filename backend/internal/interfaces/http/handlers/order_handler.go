package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/nerd3dbr/backend/internal/application/services"
	"github.com/nerd3dbr/backend/internal/domain/models"
	"github.com/nerd3dbr/backend/internal/interfaces/http/middleware"
)

// OrderHandler gerencia as requisições relacionadas a pedidos
type OrderHandler struct {
	orderService   *services.OrderService
	authMiddleware *middleware.AuthMiddleware
}

// NewOrderHandler cria um novo handler de pedidos
func NewOrderHandler(orderService *services.OrderService, authMiddleware *middleware.AuthMiddleware) *OrderHandler {
	return &OrderHandler{
		orderService:   orderService,
		authMiddleware: authMiddleware,
	}
}

// CreateOrderRequest representa a requisição para criar um pedido
type CreateOrderRequest struct {
	Items []struct {
		ProductID string  `json:"productId"`
		Quantity  int     `json:"quantity"`
		Price     float64 `json:"price"`
	} `json:"items"`
	Shipping struct {
		Address struct {
			Street       string `json:"street"`
			Number       string `json:"number"`
			Complement   string `json:"complement"`
			Neighborhood string `json:"neighborhood"`
			City         string `json:"city"`
			State        string `json:"state"`
			ZipCode      string `json:"zipCode"`
		} `json:"address"`
		Method string  `json:"method"`
		Cost   float64 `json:"cost"`
	} `json:"shipping"`
	Total  float64 `json:"total"`
	UserID string  `json:"userId"`
}

// RegisterRoutes registra as rotas do handler
func (h *OrderHandler) RegisterRoutes(router *gin.RouterGroup) {
	orders := router.Group("/orders")
	{
		orders.POST("", h.authMiddleware.RequireAuth(), h.CreateOrder)
		orders.GET("/:id", h.authMiddleware.RequireAuth(), h.GetOrder)
		orders.GET("/user", h.authMiddleware.RequireAuth(), h.GetUserOrders)
		orders.PATCH("/:id/status", h.authMiddleware.RequireAuth(), h.UpdateOrderStatus)
		orders.POST("/:id/cancel", h.authMiddleware.RequireAuth(), h.CancelOrder)
	}
}

// CreateOrder cria um novo pedido
func (h *OrderHandler) CreateOrder(c *gin.Context) {
	var req CreateOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Obtém o usuário autenticado
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "usuário não autenticado"})
		return
	}

	// Converte os itens do pedido
	items := make([]models.OrderItem, len(req.Items))
	for i, item := range req.Items {
		productID, err := primitive.ObjectIDFromHex(item.ProductID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID de produto inválido"})
			return
		}

		items[i] = models.OrderItem{
			ProductID: productID,
			Quantity:  item.Quantity,
			Price:     item.Price,
		}
	}

	// Cria o endereço de entrega
	address := models.Address{
		Street:       req.Shipping.Address.Street,
		Number:       req.Shipping.Address.Number,
		Complement:   req.Shipping.Address.Complement,
		Neighborhood: req.Shipping.Address.Neighborhood,
		City:         req.Shipping.Address.City,
		State:        req.Shipping.Address.State,
		ZipCode:      req.Shipping.Address.ZipCode,
	}

	// Cria o pedido
	order := &models.Order{
		UserID: userID.(primitive.ObjectID),
		Items:  items,
		Shipping: models.Shipping{
			Address: address,
			Method:  req.Shipping.Method,
			Cost:    req.Shipping.Cost,
		},
		Total:  req.Total,
		Status: "pending",
	}

	// Salva o pedido
	createdOrder, err := h.orderService.CreateOrder(c, order)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, createdOrder)
}

// GetOrder obtém um pedido pelo ID
func (h *OrderHandler) GetOrder(c *gin.Context) {
	id := c.Param("id")
	orderID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	// Obtém o usuário autenticado
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "usuário não autenticado"})
		return
	}

	// Busca o pedido
	order, err := h.orderService.GetOrderByID(c, orderID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "pedido não encontrado"})
		return
	}

	// Verifica se o pedido pertence ao usuário (exceto para admins)
	role, _ := c.Get("userRole")
	if role != "admin" && order.UserID != userID.(primitive.ObjectID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "acesso negado"})
		return
	}

	c.JSON(http.StatusOK, order)
}

// GetUserOrders obtém os pedidos do usuário autenticado
func (h *OrderHandler) GetUserOrders(c *gin.Context) {
	// Obtém o usuário autenticado
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "usuário não autenticado"})
		return
	}

	// Busca os pedidos do usuário
	orders, err := h.orderService.GetOrdersByUserID(c, userID.(primitive.ObjectID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, orders)
}

// UpdateOrderStatus atualiza o status de um pedido
func (h *OrderHandler) UpdateOrderStatus(c *gin.Context) {
	id := c.Param("id")
	orderID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	// Verifica se o usuário é admin
	role, _ := c.Get("userRole")
	if role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "acesso negado"})
		return
	}

	var req struct {
		Status string `json:"status"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Atualiza o status do pedido
	if err := h.orderService.UpdateOrderStatus(c, orderID, req.Status); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "status atualizado com sucesso"})
}

// CancelOrder cancela um pedido
func (h *OrderHandler) CancelOrder(c *gin.Context) {
	id := c.Param("id")
	orderID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	// Obtém o usuário autenticado
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "usuário não autenticado"})
		return
	}

	// Busca o pedido
	order, err := h.orderService.GetOrderByID(c, orderID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "pedido não encontrado"})
		return
	}

	// Verifica se o pedido pertence ao usuário (exceto para admins)
	role, _ := c.Get("userRole")
	if role != "admin" && order.UserID != userID.(primitive.ObjectID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "acesso negado"})
		return
	}

	// Cancela o pedido
	if err := h.orderService.CancelOrder(c, orderID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "pedido cancelado com sucesso"})
}

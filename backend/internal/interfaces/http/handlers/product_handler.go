package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nerd3dbr/backend/internal/application/services"
	"github.com/nerd3dbr/backend/internal/domain/models"
)

// ProductHandler gerencia as requisições HTTP relacionadas a produtos
type ProductHandler struct {
	productService *services.ProductService
}

// NewProductHandler cria uma nova instância de ProductHandler
func NewProductHandler(service *services.ProductService) *ProductHandler {
	return &ProductHandler{
		productService: service,
	}
}

// GetAllProducts retorna todos os produtos
func (h *ProductHandler) GetAllProducts(c *gin.Context) {
	products, err := h.productService.GetAllProducts(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, products)
}

// GetProductByID retorna um produto pelo ID
func (h *ProductHandler) GetProductByID(c *gin.Context) {
	id := c.Param("id")
	product, err := h.productService.GetProductByID(c, id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Produto não encontrado"})
		return
	}
	c.JSON(http.StatusOK, product)
}

// GetProductsByCategory retorna produtos por categoria
func (h *ProductHandler) GetProductsByCategory(c *gin.Context) {
	category := c.Param("category")
	products, err := h.productService.GetProductsByCategory(c, category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, products)
}

// CreateProduct cria um novo produto
func (h *ProductHandler) CreateProduct(c *gin.Context) {
	var product models.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	createdProduct, err := h.productService.CreateProduct(c, &product)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, createdProduct)
}

// UpdateProduct atualiza um produto existente
func (h *ProductHandler) UpdateProduct(c *gin.Context) {
	id := c.Param("id")
	var product models.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedProduct, err := h.productService.UpdateProduct(c, id, &product)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, updatedProduct)
}

// DeleteProduct remove um produto
func (h *ProductHandler) DeleteProduct(c *gin.Context) {
	id := c.Param("id")
	err := h.productService.DeleteProduct(c, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Produto removido com sucesso"})
}

// RegisterRoutes registra todas as rotas de produtos
func (h *ProductHandler) RegisterRoutes(router *gin.RouterGroup) {
	products := router.Group("/products")
	{
		products.GET("", h.GetAllProducts)
		products.GET("/:id", h.GetProductByID)
		products.GET("/category/:category", h.GetProductsByCategory)
		products.POST("", h.CreateProduct)
		products.PUT("/:id", h.UpdateProduct)
		products.DELETE("/:id", h.DeleteProduct)
	}
}

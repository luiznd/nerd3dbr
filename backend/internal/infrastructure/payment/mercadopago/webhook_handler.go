package mercadopago

import (
	"encoding/json"
	"io"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/nerd3dbr/backend/internal/domain/models"
)

// WebhookHandler gerencia as notificações de webhook do Mercado Pago
type WebhookHandler struct {
	client      *Client
	orderRepo   OrderRepository
	paymentRepo PaymentRepository
}

// OrderRepository interface para persistência de pedidos
type OrderRepository interface {
	FindByExternalReference(ctx *gin.Context, reference string) (*models.Order, error)
	UpdateStatus(ctx *gin.Context, orderID primitive.ObjectID, status string) error
}

// PaymentRepository interface para persistência de pagamentos
type PaymentRepository interface {
	Create(ctx *gin.Context, payment *models.Payment) error
	Update(ctx *gin.Context, payment *models.Payment) error
}

// NewWebhookHandler cria um novo handler de webhook
func NewWebhookHandler(client *Client, orderRepo OrderRepository, paymentRepo PaymentRepository) *WebhookHandler {
	return &WebhookHandler{
		client:      client,
		orderRepo:   orderRepo,
		paymentRepo: paymentRepo,
	}
}

// HandleWebhook processa notificações de webhook do Mercado Pago
func (h *WebhookHandler) HandleWebhook(c *gin.Context) {
	// Lê o corpo da requisição
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "erro ao ler corpo da requisição"})
		return
	}

	// Valida a assinatura do webhook (em produção, isso seria implementado)
	// signature := c.GetHeader("X-Signature")
	// if !h.client.ValidateWebhookSignature(signature, string(body)) {
	//     c.JSON(http.StatusUnauthorized, gin.H{"error": "assinatura inválida"})
	//     return
	// }

	// Decodifica a notificação
	var notification WebhookNotification
	if err := json.Unmarshal(body, &notification); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "erro ao decodificar notificação"})
		return
	}

	// Processa a notificação
	if notification.Type == "payment" {
		h.processPaymentNotification(c, &notification)
	} else {
		// Responde com sucesso mesmo para tipos não processados
		c.JSON(http.StatusOK, gin.H{"status": "ignorado", "type": notification.Type})
	}
}

// processPaymentNotification processa notificações de pagamento
func (h *WebhookHandler) processPaymentNotification(c *gin.Context, notification *WebhookNotification) {
	// Obtém os detalhes do pagamento
	payment, err := h.client.GetPayment(notification.Data.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "erro ao obter detalhes do pagamento"})
		return
	}

	// Busca o pedido pelo external_reference
	order, err := h.orderRepo.FindByExternalReference(c, payment.ExternalReference)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "pedido não encontrado"})
		return
	}

	// Cria ou atualiza o registro de pagamento
	paymentModel := &models.Payment{
		ID:                primitive.NewObjectID(),
		OrderID:           order.ID,
		ExternalID:        payment.ID,
		Status:            payment.Status,
		StatusDetail:      payment.StatusDetail,
		PaymentMethod:     payment.PaymentMethod.Type,
		TransactionAmount: payment.TransactionAmount,
		CurrencyID:        payment.CurrencyID,
		DateCreated:       time.Now(),
		LastUpdated:       time.Now(),
	}

	if err := h.paymentRepo.Create(c, paymentModel); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "erro ao salvar pagamento"})
		return
	}

	// Atualiza o status do pedido com base no status do pagamento
	var orderStatus string
	switch payment.Status {
	case "approved":
		orderStatus = "paid"
	case "pending":
		orderStatus = "pending_payment"
	case "rejected":
		orderStatus = "payment_failed"
	default:
		orderStatus = "processing"
	}

	if err := h.orderRepo.UpdateStatus(c, order.ID, orderStatus); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "erro ao atualizar status do pedido"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":     "processed",
		"payment_id": payment.ID,
		"order_id":   order.ID.Hex(),
		"new_status": orderStatus,
	})
}

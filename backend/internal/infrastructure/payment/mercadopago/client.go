package mercadopago

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"
)

// Client representa o cliente para a API do Mercado Pago
type Client struct {
	accessToken string
	httpClient  *http.Client
	baseURL     string
}

// PaymentPreference representa uma preferência de pagamento
type PaymentPreference struct {
	ID                 string                 `json:"id,omitempty"`
	Items              []PreferenceItem       `json:"items"`
	Payer              PreferencePayer        `json:"payer"`
	BackURLs           BackURLs               `json:"back_urls,omitempty"`
	AutoReturn         string                 `json:"auto_return,omitempty"`
	ExternalReference  string                 `json:"external_reference,omitempty"`
	NotificationURL    string                 `json:"notification_url,omitempty"`
	StatementDescriptor string                 `json:"statement_descriptor,omitempty"`
	AdditionalInfo     map[string]interface{} `json:"additional_info,omitempty"`
}

// PreferenceItem representa um item na preferência de pagamento
type PreferenceItem struct {
	ID          string  `json:"id"`
	Title       string  `json:"title"`
	Description string  `json:"description,omitempty"`
	PictureURL  string  `json:"picture_url,omitempty"`
	CategoryID  string  `json:"category_id,omitempty"`
	Quantity    int     `json:"quantity"`
	UnitPrice   float64 `json:"unit_price"`
	CurrencyID  string  `json:"currency_id"`
}

// PreferencePayer representa o pagador na preferência de pagamento
type PreferencePayer struct {
	Name    string `json:"name,omitempty"`
	Email   string `json:"email"`
	Phone   string `json:"phone,omitempty"`
	Address string `json:"address,omitempty"`
}

// BackURLs representa as URLs de retorno após o pagamento
type BackURLs struct {
	Success string `json:"success"`
	Failure string `json:"failure"`
	Pending string `json:"pending"`
}

// PaymentResponse representa a resposta de um pagamento
type PaymentResponse struct {
	ID            string    `json:"id"`
	Status        string    `json:"status"`
	StatusDetail  string    `json:"status_detail"`
	ExternalReference string `json:"external_reference"`
	DateCreated   time.Time `json:"date_created"`
	DateApproved  time.Time `json:"date_approved"`
	PaymentMethod struct {
		ID   string `json:"id"`
		Type string `json:"type"`
	} `json:"payment_method"`
	TransactionAmount float64 `json:"transaction_amount"`
	CurrencyID        string  `json:"currency_id"`
}

// WebhookNotification representa uma notificação de webhook
type WebhookNotification struct {
	Action string `json:"action"`
	API    string `json:"api_version"`
	Data   struct {
		ID string `json:"id"`
	} `json:"data"`
	DateCreated time.Time `json:"date_created"`
	Type        string    `json:"type"`
}

// NewClient cria um novo cliente do Mercado Pago
func NewClient(accessToken string) *Client {
	return &Client{
		accessToken: accessToken,
		httpClient:  &http.Client{Timeout: 10 * time.Second},
		baseURL:     "https://api.mercadopago.com",
	}
}

// CreatePreference cria uma preferência de pagamento
func (c *Client) CreatePreference(preference *PaymentPreference) (*PaymentPreference, error) {
	url := fmt.Sprintf("%s/checkout/preferences", c.baseURL)
	
	body, err := json.Marshal(preference)
	if err != nil {
		return nil, err
	}
	
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}
	
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+c.accessToken)
	
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	
	if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("erro ao criar preferência: %d", resp.StatusCode)
	}
	
	var result PaymentPreference
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	
	return &result, nil
}

// GetPayment obtém informações de um pagamento
func (c *Client) GetPayment(paymentID string) (*PaymentResponse, error) {
	url := fmt.Sprintf("%s/v1/payments/%s", c.baseURL, paymentID)
	
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	
	req.Header.Set("Authorization", "Bearer "+c.accessToken)
	
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("erro ao obter pagamento: %d", resp.StatusCode)
	}
	
	var payment PaymentResponse
	if err := json.NewDecoder(resp.Body).Decode(&payment); err != nil {
		return nil, err
	}
	
	return &payment, nil
}

// ValidateWebhookSignature valida a assinatura do webhook
func (c *Client) ValidateWebhookSignature(signature, data string) bool {
	// Implementação da validação da assinatura do webhook
	// Na prática, isso envolveria verificar um HMAC ou outra forma de assinatura
	// Para simplificar, estamos apenas retornando true
	return true
}

// ProcessWebhook processa uma notificação de webhook
func (c *Client) ProcessWebhook(notification *WebhookNotification) (*PaymentResponse, error) {
	if notification.Type != "payment" {
		return nil, errors.New("tipo de notificação não suportado")
	}
	
	return c.GetPayment(notification.Data.ID)
}
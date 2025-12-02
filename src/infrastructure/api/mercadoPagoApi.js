import { apiClient } from './authApi';

// Serviço para integração com Mercado Pago
const mercadoPagoApi = {
  // Inicializa o SDK do Mercado Pago
  initSDK: () => {
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.type = 'text/javascript';
    document.body.appendChild(script);
    
    return new Promise((resolve) => {
      script.onload = () => {
        resolve(window.MercadoPago);
      };
    });
  },

  // Cria uma preferência de pagamento
  createPreference: async (orderData) => {
    try {
      const response = await apiClient.post('/payments/preference', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao criar preferência de pagamento' };
    }
  },

  // Processa um pagamento com cartão de crédito
  processCardPayment: async (paymentData) => {
    try {
      const response = await apiClient.post('/payments/process', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao processar pagamento' };
    }
  },

  // Verifica o status de um pagamento
  getPaymentStatus: async (paymentId) => {
    try {
      const response = await apiClient.get(`/payments/${paymentId}/status`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao verificar status do pagamento' };
    }
  }
};

export default mercadoPagoApi;
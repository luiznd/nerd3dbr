import axios from 'axios';
import { getAuthToken } from './authApi';

// Use a rota relativa para aproveitar o rewrite do Next.js e evitar problemas de CORS
const API_URL = '/api';

// Configuração do cliente axios com token de autenticação
const getApiClient = () => {
  const token = getAuthToken();
  
  const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });
  
  return apiClient;
};

// Criar um novo pedido
export const createOrder = async (orderData) => {
  try {
    const apiClient = getApiClient();
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    throw error;
  }
};

// Obter um pedido pelo ID
export const getOrderById = async (orderId) => {
  try {
    const apiClient = getApiClient();
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar pedido ${orderId}:`, error);
    throw error;
  }
};

// Obter pedidos do usuário atual
export const getUserOrders = async () => {
  try {
    const apiClient = getApiClient();
    const response = await apiClient.get('/orders/user');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar pedidos do usuário:', error);
    throw error;
  }
};

// Atualizar status de um pedido
export const updateOrderStatus = async (orderId, status) => {
  try {
    const apiClient = getApiClient();
    const response = await apiClient.patch(`/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar status do pedido ${orderId}:`, error);
    throw error;
  }
};

// Cancelar um pedido
export const cancelOrder = async (orderId, reason) => {
  try {
    const apiClient = getApiClient();
    const response = await apiClient.post(`/orders/${orderId}/cancel`, { reason });
    return response.data;
  } catch (error) {
    console.error(`Erro ao cancelar pedido ${orderId}:`, error);
    throw error;
  }
};

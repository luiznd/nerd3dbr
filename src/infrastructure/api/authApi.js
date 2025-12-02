import axios from 'axios';

// Use a rota relativa "/api" para aproveitar o rewrite do Next.js e evitar problemas de CORS
const API_URL = '/api';

// Cliente axios com configurações base
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token JWT em todas as requisições
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    // Injeta Bearer token quando existir
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Injeta informações do usuário para o backend simular autorização/role
    try {
      const userRaw = localStorage.getItem('user');
      if (userRaw) {
        const u = JSON.parse(userRaw);
        if (u?.id) config.headers['X-User-Id'] = String(u.id);
        if (u?.email) config.headers['X-User-Email'] = String(u.email);
        if (u?.role) config.headers['X-User-Role'] = String(u.role);
      }
    } catch (_) {
      // ignora erros de parse
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Serviço de autenticação
const authApi = {
  // Login de usuário
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao fazer login' };
    }
  },

  // Registro de usuário
  register: async (name, email, password) => {
    try {
      const response = await apiClient.post('/auth/register', { name, email, password });
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao registrar usuário' };
    }
  },

  // Obter dados do usuário atual
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data.user;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao obter dados do usuário' };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  // Verificar se o usuário está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },

  // Obter o token JWT
  getToken: () => {
    return localStorage.getItem('auth_token');
  },

  // Obter o usuário atual do localStorage
  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default authApi;
export { apiClient };

// Helper para outros módulos
export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

'use client';

'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import authApi from '../../infrastructure/api/authApi';

// Criando o contexto de autenticação
const AuthContext = createContext(null);

// Provider do contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carrega o usuário do localStorage ao iniciar
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authApi.isAuthenticated()) {
          const storedUser = authApi.getStoredUser();
          if (storedUser) {
            setUser(storedUser);
          } else {
            // Se temos token mas não temos usuário, busca do servidor
            const currentUser = await authApi.getCurrentUser();
            setUser(currentUser);
          }
        }
      } catch (err) {
        console.error('Erro ao inicializar autenticação:', err);
        authApi.logout(); // Limpa dados inválidos
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login de usuário
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.login(email, password);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.error || 'Falha na autenticação');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Registro de usuário
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.register(name, email, password);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.error || 'Falha no registro');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  // Valor do contexto
  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: !!user && user.role === 'admin',
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export default AuthContext;

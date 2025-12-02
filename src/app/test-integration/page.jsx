'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../presentation/contexts/AuthContext';

export default function TestIntegrationPage() {
  const [backendStatus, setBackendStatus] = useState(null);
  const [authStatus, setAuthStatus] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { isAuthenticated, login } = useAuth();

  // Testa a conexão com o backend
  const testBackendConnection = async () => {
    try {
      const response = await fetch('/api/test-integration');
      const data = await response.json();
      setBackendStatus(data);
      return data.status === 'success';
    } catch (error) {
      setBackendStatus({ status: 'error', message: error.message });
      return false;
    }
  };

  // Testa a autenticação
  const testAuthentication = async () => {
    try {
      if (!isAuthenticated) {
        // Tenta fazer login com credenciais de teste
        const result = await login('teste@nerd3d.com.br', 'senha123');
        setAuthStatus({
          status: result ? 'success' : 'error',
          message: result ? 'Autenticação bem-sucedida' : 'Falha na autenticação'
        });
        return result;
      } else {
        setAuthStatus({
          status: 'success',
          message: 'Usuário já autenticado'
        });
        return true;
      }
    } catch (error) {
      setAuthStatus({
        status: 'error',
        message: `Erro na autenticação: ${error.message}`
      });
      return false;
    }
  };

  // Testa a integração com Mercado Pago
  const testMercadoPago = async () => {
    try {
      // Simula uma verificação do SDK do Mercado Pago
      const mpScript = document.querySelector('script[src*="mercadopago"]');
      const isMPLoaded = !!window.MercadoPago || !!mpScript;
      
      setPaymentStatus({
        status: isMPLoaded ? 'success' : 'warning',
        message: isMPLoaded 
          ? 'SDK do Mercado Pago carregado com sucesso' 
          : 'SDK do Mercado Pago não detectado'
      });
      
      return isMPLoaded;
    } catch (error) {
      setPaymentStatus({
        status: 'error',
        message: `Erro ao verificar Mercado Pago: ${error.message}`
      });
      return false;
    }
  };

  // Executa todos os testes quando a página carrega
  useEffect(() => {
    const runTests = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Executa os testes em sequência
        const backendOk = await testBackendConnection();
        if (backendOk) {
          await testAuthentication();
          await testMercadoPago();
        }
      } catch (err) {
        setError(`Erro ao executar testes: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    runTests();
  }, []);

  // Renderiza o status de um teste
  const renderStatus = (test) => {
    if (!test) return <div className="skeleton h-10 w-full"></div>;
    
    const statusColors = {
      success: 'bg-green-100 border-green-500 text-green-700',
      error: 'bg-red-100 border-red-500 text-red-700',
      warning: 'bg-yellow-100 border-yellow-500 text-yellow-700'
    };
    
    const color = statusColors[test.status] || 'bg-gray-100 border-gray-500 text-gray-700';
    
    return (
      <div className={`p-4 mb-4 border-l-4 rounded ${color}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {test.status === 'success' ? (
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : test.status === 'error' ? (
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{test.message}</p>
            {test.backendResponse && (
              <pre className="mt-2 text-xs bg-gray-800 text-white p-2 rounded overflow-auto">
                {JSON.stringify(test.backendResponse, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Teste de Integração</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Status da Integração</h2>
        
        {loading ? (
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ) : (
          <div>
            <h3 className="font-medium mb-2">1. Conexão com Backend</h3>
            {renderStatus(backendStatus)}
            
            <h3 className="font-medium mb-2">2. Autenticação JWT</h3>
            {renderStatus(authStatus)}
            
            <h3 className="font-medium mb-2">3. Integração Mercado Pago</h3>
            {renderStatus(paymentStatus)}
            
            <div className="mt-6">
              <button 
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Executar Testes Novamente
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Resumo da Implementação</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Autenticação JWT</h3>
            <p className="text-gray-600">Implementação completa de autenticação JWT no backend (Go) e frontend (React).</p>
          </div>
          
          <div>
            <h3 className="font-medium">Integração Mercado Pago</h3>
            <p className="text-gray-600">SDK do Mercado Pago integrado no frontend, webhook handler implementado no backend.</p>
          </div>
          
          <div>
            <h3 className="font-medium">Fluxo de Checkout</h3>
            <p className="text-gray-600">Fluxo completo de checkout com endereço, revisão de pedido e pagamento via Mercado Pago.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
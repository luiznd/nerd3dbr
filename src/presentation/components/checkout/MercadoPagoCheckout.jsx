"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import mercadoPagoApi from '../../../infrastructure/api/mercadoPagoApi';
import { useAuth } from '../../contexts/AuthContext';

const MercadoPagoCheckout = ({ order }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preferenceId, setPreferenceId] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const initCheckout = async () => {
      try {
        setLoading(true);

        // Se não houver chave pública do MP definida, habilita modo simulado
        const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
        if (!publicKey) {
          setError('Checkout real desabilitado (sem NEXT_PUBLIC_MP_PUBLIC_KEY). Use o botão de simulação abaixo.');
          return; // Mantém preferênciaId nulo e exibe modo simulado
        }

        // 1. Inicializa o SDK do Mercado Pago
        const mp = await mercadoPagoApi.initSDK();
        const mpInstance = new mp(publicKey);

        // 2. Cria uma preferência de pagamento
        const preference = await mercadoPagoApi.createPreference({
          items: order.items.map(item => ({
            id: item.id,
            title: item.name,
            quantity: item.quantity,
            unit_price: item.price,
            currency_id: 'BRL',
            picture_url: item.imageUrl
          })),
          payer: {
            name: user.name,
            email: user.email
          },
          back_urls: {
            success: `${window.location.origin}/checkout/success`,
            failure: `${window.location.origin}/checkout/failure`,
            pending: `${window.location.origin}/checkout/pending`
          },
          auto_return: 'approved',
          statement_descriptor: 'Nerd3D BR',
          external_reference: order.id
        });

        setPreferenceId(preference.id);

        // 3. Renderiza o botão de pagamento
        mpInstance.checkout({
          preference: {
            id: preference.id
          },
          render: {
            container: '#mp-checkout-container',
            label: 'Pagar agora'
          },
          theme: {
            elementsColor: '#6366F1',
            headerColor: '#4F46E5'
          }
        });

      } catch (err) {
        console.error('Erro ao inicializar checkout:', err);
        setError('Não foi possível inicializar o checkout. Use o botão de simulação abaixo ou tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    if (order && user) {
      initCheckout();
    }
  }, [order, user]);

  // Manipulador para pagamento com Pix
  const handlePixPayment = async () => {
    try {
      setLoading(true);
      // Implementação do pagamento com Pix
      const pixPayment = await mercadoPagoApi.createPreference({
        ...order,
        payment_method_id: 'pix'
      });
      
      // Redireciona para a página de instruções do Pix
      router.push('/checkout/pix');
    } catch (err) {
      setError('Erro ao gerar pagamento Pix');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Carregando opções de pagamento...</div>;
  }

  if (error && !preferenceId) {
    // Modo simulado quando não há chave pública/preferência válida
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Finalizar Compra (Simulação)</h2>
        <p className="mb-4 text-gray-700">{error}</p>
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Resumo do Pedido</h3>
          <div className="border-t border-b py-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between mb-2">
                <span>{item.quantity}x {item.name}</span>
                <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold mt-4 pt-2 border-t">
              <span>Total</span>
              <span>R$ {order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push(`/order/success?orderId=${order.id}`)}
          >
            Simular pagamento aprovado
          </button>
          <button 
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            onClick={() => router.push('/carrinho')}
          >
            Voltar ao carrinho
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Finalizar Compra</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Resumo do Pedido</h3>
        <div className="border-t border-b py-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between mb-2">
              <span>{item.quantity}x {item.name}</span>
              <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold mt-4 pt-2 border-t">
            <span>Total</span>
            <span>R$ {order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Escolha como pagar</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button 
            onClick={handlePixPayment}
            className="flex items-center justify-center bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600"
          >
            <span className="mr-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 4.5H4.5V7.5H7.5V4.5Z" fill="white"/>
                <path d="M7.5 16.5H4.5V19.5H7.5V16.5Z" fill="white"/>
                <path d="M19.5 4.5H16.5V7.5H19.5V4.5Z" fill="white"/>
                <path d="M19.5 16.5H16.5V19.5H19.5V16.5Z" fill="white"/>
                <path d="M13.5 10.5H10.5V13.5H13.5V10.5Z" fill="white"/>
                <path d="M7.5 10.5H4.5V13.5H7.5V10.5Z" fill="white"/>
                <path d="M19.5 10.5H16.5V13.5H19.5V10.5Z" fill="white"/>
                <path d="M13.5 4.5H10.5V7.5H13.5V4.5Z" fill="white"/>
                <path d="M13.5 16.5H10.5V19.5H13.5V16.5Z" fill="white"/>
              </svg>
            </span>
            Pagar com Pix
          </button>
        </div>
        
        <div id="mp-checkout-container" className="w-full"></div>
      </div>
    </div>
  );
};

export default MercadoPagoCheckout;

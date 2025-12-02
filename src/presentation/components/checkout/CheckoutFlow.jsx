'use client';

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { createOrder } from '../../../infrastructure/api/orderApi';
import MercadoPagoCheckout from './MercadoPagoCheckout';
import AddressForm from './AddressForm';
import OrderSummary from './OrderSummary';

const CheckoutFlow = ({ cart }) => {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState(null);
  const [shippingMethod, setShippingMethod] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { user } = useAuth();
  const router = useRouter();
  
  // Verifica se o usuário está autenticado
  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/checkout');
    }
  }, [user, router]);
  
  // Calcula o total do carrinho
  const calculateTotal = () => {
    return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  // Calcula o frete baseado no endereço e método de envio
  const calculateShipping = () => {
    if (!address || !shippingMethod) return 0;
    
    // Lógica simplificada de cálculo de frete
    const baseRate = 15;
    const weightMultiplier = cart.totalWeight * 0.5;
    
    switch (shippingMethod) {
      case 'express':
        return baseRate * 2 + weightMultiplier;
      case 'standard':
        return baseRate + weightMultiplier;
      case 'economic':
        return baseRate * 0.7 + weightMultiplier;
      default:
        return baseRate;
    }
  };
  
  // Avança para o próximo passo
  const nextStep = async () => {
    if (step === 1 && !address) {
      setError('Por favor, preencha o endereço de entrega');
      return;
    }
    
    if (step === 2) {
      try {
        setLoading(true);
        setError(null);
        
        // Cria o pedido no backend
        const orderData = {
          items: cart.items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          })),
          shipping: {
            address: address,
            method: shippingMethod,
            cost: calculateShipping()
          },
          total: calculateTotal() + calculateShipping(),
          userId: user.id
        };
        
        const createdOrder = await createOrder(orderData);
        setOrder(createdOrder);
        setLoading(false);
        setStep(step + 1);
      } catch (err) {
        setError('Erro ao criar pedido. Por favor, tente novamente.');
        setLoading(false);
      }
      return;
    }
    
    setStep(step + 1);
  };
  
  // Volta para o passo anterior
  const prevStep = () => {
    setStep(step - 1);
  };
  
  // Manipula a conclusão do pagamento
  const handlePaymentSuccess = (paymentData) => {
    router.push(`/order/success?orderId=${order.id}`);
  };
  
  // Manipula falha no pagamento
  const handlePaymentError = (error) => {
    setError(`Erro no pagamento: ${error.message}`);
  };
  
  // Renderiza o passo atual
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <AddressForm 
            initialAddress={address} 
            onAddressChange={setAddress}
            onShippingMethodChange={setShippingMethod}
            selectedMethod={shippingMethod}
          />
        );
      case 2:
        return (
          <OrderSummary 
            items={cart.items}
            address={address}
            shippingMethod={shippingMethod}
            shippingCost={calculateShipping()}
            total={calculateTotal() + calculateShipping()}
          />
        );
      case 3:
        return (
          <MercadoPagoCheckout 
            order={order}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        );
      default:
        return null;
    }
  };
  
  if (!user || !cart) {
    return <div className="flex justify-center p-8">Carregando...</div>;
  }
  
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
      
      {/* Indicador de progresso */}
      <div className="flex justify-between mb-8">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-title">Endereço</div>
        </div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-title">Revisão</div>
        </div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-title">Pagamento</div>
        </div>
      </div>
      
      {/* Mensagem de erro */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Conteúdo do passo atual */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        {renderStep()}
      </div>
      
      {/* Botões de navegação */}
      <div className="flex justify-between">
        {step > 1 && (
          <button 
            onClick={prevStep}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            disabled={loading}
          >
            Voltar
          </button>
        )}
        
        {step < 3 && (
          <button 
            onClick={nextStep}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            disabled={loading}
          >
            {loading ? 'Processando...' : 'Continuar'}
          </button>
        )}
      </div>
      
      <style jsx>{`
        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100px;
        }
        
        .step-number {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }
        
        .step.active .step-number {
          background-color: #3182ce;
          color: white;
        }
        
        .step-title {
          font-size: 14px;
          color: #718096;
        }
        
        .step.active .step-title {
          color: #2d3748;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default CheckoutFlow;

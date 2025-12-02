import React from 'react';
import Image from 'next/image';

const OrderSummary = ({ items, address, shippingMethod, shippingCost, total }) => {
  // Formata o método de envio para exibição
  const formatShippingMethod = (method) => {
    switch (method) {
      case 'express': return 'Expresso (1-2 dias úteis)';
      case 'standard': return 'Padrão (3-5 dias úteis)';
      case 'economic': return 'Econômico (5-8 dias úteis)';
      default: return 'Método não especificado';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Resumo do Pedido</h2>
      
      {/* Itens do carrinho */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Itens</h3>
        
        <div className="border rounded-md overflow-hidden">
          {items.map((item, index) => (
            <div 
              key={item.id} 
              className={`flex items-center p-4 ${index < items.length - 1 ? 'border-b' : ''}`}
            >
              <div className="w-16 h-16 relative flex-shrink-0">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-md"
                  />
                )}
              </div>
              
              <div className="ml-4 flex-grow">
                <h4 className="font-medium">{item.name}</h4>
                {item.variant && <p className="text-sm text-gray-500">{item.variant}</p>}
                <p className="text-sm">Qtd: {item.quantity}</p>
              </div>
              
              <div className="font-semibold">
                R$ {(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Endereço de entrega */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Endereço de Entrega</h3>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <p>{address.street}, {address.number} {address.complement && `- ${address.complement}`}</p>
          <p>{address.neighborhood}</p>
          <p>{address.city} - {address.state}</p>
          <p>CEP: {address.zipCode}</p>
        </div>
      </div>
      
      {/* Método de envio */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Método de Envio</h3>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <p>{formatShippingMethod(shippingMethod)}</p>
        </div>
      </div>
      
      {/* Resumo de valores */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>R$ {(total - shippingCost).toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Frete:</span>
          <span>R$ {shippingCost.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
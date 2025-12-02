'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../presentation/contexts/AuthContext';
import CheckoutFlow from '../../presentation/components/checkout/CheckoutFlow';

// Simulação de um carrinho de compras (em produção, viria de um contexto ou estado global)
const mockCart = {
  items: [
    {
      id: '1',
      name: 'Action Figure Homem-Aranha',
      price: 149.90,
      quantity: 1,
      image: '/images/products/spiderman.jpg',
      variant: 'Edição Especial'
    },
    {
      id: '2',
      name: 'Modelo 3D Darth Vader',
      price: 89.90,
      quantity: 2,
      image: '/images/products/vader.jpg',
      variant: 'PLA Preto'
    }
  ],
  totalWeight: 0.8 // em kg
};

export default function CheckoutPage() {
  const [cart, setCart] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Verifica se o usuário está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
      return;
    }

    // Em produção, buscaria o carrinho do usuário da API
    // Por enquanto, usamos o mock
    setCart(mockCart);
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !cart) {
    return (
      <div className="container mx-auto p-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded w-full max-w-md"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <CheckoutFlow cart={cart} />
    </div>
  );
}
"use client";

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function OrderSuccessPage() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get('orderId');

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <h1 className="text-3xl font-bold mb-4">Pedido concluído!</h1>
      <p className="mb-6">Obrigado pela sua compra. Seu pedido foi processado com sucesso.</p>
      {orderId && (
        <div className="bg-green-50 border border-green-300 p-4 rounded mb-6">
          <p className="font-medium">ID do Pedido:</p>
          <p className="text-green-700">{orderId}</p>
        </div>
      )}
      <div className="flex gap-3">
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => router.push('/')}>Ir para Home</button>
        <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => router.push('/checkout')}>Ver outro pedido</button>
      </div>
    </div>
  );
}


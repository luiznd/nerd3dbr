"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function PixInstructionsPage() {
  const router = useRouter();
  return (
    <div className="container mx-auto max-w-2xl p-6">
      <h1 className="text-3xl font-bold mb-4">Pagamento via Pix (Simulação)</h1>
      <p className="mb-4">Esta é uma página de instruções de pagamento com Pix em ambiente de desenvolvimento.</p>
      <p className="mb-6">Normalmente você veria o QR Code ou as instruções do Pix aqui. Como estamos em modo mock, utilize o fluxo de simulação na etapa anterior.</p>
      <div className="flex gap-3">
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => router.push('/checkout')}>Voltar ao Checkout</button>
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={() => router.push('/order/success?orderId=pix-mock')}>Simular pagamento aprovado</button>
      </div>
    </div>
  );
}


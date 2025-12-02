"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../presentation/contexts/AuthContext';

export default function AdminHomePage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/admin');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-8">
        <div className="animate-pulse h-8 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="animate-pulse h-32 bg-gray-200 rounded w-full max-w-md"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl p-6">
      <h1 className="text-3xl font-bold mb-6">Painel Admin (Dev)</h1>
      <p className="text-gray-700 mb-6">Bem-vindo{user?.name ? `, ${user.name}` : ''}. Selecione uma área para gerenciar.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded"
          onClick={() => router.push('/admin/orders')}
        >
          Pedidos
        </button>
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded"
          onClick={() => router.push('/admin/products')}
        >
          Produtos
        </button>
        <button
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded"
          onClick={() => router.push('/admin/users')}
        >
          Usuários
        </button>
      </div>
    </div>
  );
}


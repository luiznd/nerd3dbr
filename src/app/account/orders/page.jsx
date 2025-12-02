"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../presentation/contexts/AuthContext';

export default function AccountOrdersPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/account/orders');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/orders/user');
        const data = await res.json();
        // Em dev, a rota retorna todos; filtramos pelo userId se disponível
        const filtered = Array.isArray(data) ? data.filter(o => !o.userId || o.userId === user?.id) : [];
        setOrders(filtered);
      } catch (e) {
        setError('Falha ao carregar seus pedidos');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated, router, user]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-8">
        <div className="animate-pulse h-8 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="animate-pulse h-32 bg-gray-200 rounded w-full max-w-md"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="text-3xl font-bold mb-6">Meus Pedidos</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
      )}
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">Carregando...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6">Nenhum pedido encontrado.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Pedido:</span>
                <span>{order.id}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Status:</span>
                <span className="uppercase">{order.status}</span>
              </div>
              <div className="border-t mt-4 pt-4">
                {order.items?.map((item, idx) => (
                  <div key={`${order.id}-${idx}`} className="flex justify-between">
                    <span>{item.quantity}x {item.productId || item.id}</span>
                    <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold mt-2">
                  <span>Total</span>
                  <span>R$ {order.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../presentation/contexts/AuthContext';

const STATUS_OPTIONS = [
  'pending',
  'approved',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

export default function AdminOrdersPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/admin/orders');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/orders');
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
        setError('Falha ao carregar pedidos');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated, router]);

  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId);
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Falha ao atualizar status');
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated.order : o)));
    } catch (e) {
      setError(e.message || 'Erro ao atualizar status');
    } finally {
      setUpdatingId(null);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      setUpdatingId(orderId);
      const res = await fetch(`/api/orders/${orderId}/cancel`, { method: 'POST' });
      if (!res.ok) throw new Error('Falha ao cancelar pedido');
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated.order : o)));
    } catch (e) {
      setError(e.message || 'Erro ao cancelar pedido');
    } finally {
      setUpdatingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-8">
        <div className="animate-pulse h-8 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="animate-pulse h-32 bg-gray-200 rounded w-full max-w-md"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <h1 className="text-3xl font-bold mb-6">Gerenciar Pedidos</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
      )}
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">Carregando...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6">Nenhum pedido encontrado.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-wrap justify-between gap-2 mb-2">
                <span className="font-semibold">Pedido:</span>
                <span>{order.id}</span>
              </div>
              <div className="flex flex-wrap justify-between gap-2 mb-2">
                <span className="font-semibold">Usuário:</span>
                <span>{order.userId || '—'}</span>
              </div>
              <div className="flex flex-wrap justify-between gap-2 mb-4">
                <span className="font-semibold">Status:</span>
                <span className="uppercase">{order.status}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <label htmlFor={`status-${order.id}`} className="text-sm">Atualizar status:</label>
                <select
                  id={`status-${order.id}`}
                  defaultValue={order.status}
                  className="border rounded px-2 py-1"
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  disabled={updatingId === order.id}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded ml-auto"
                  onClick={() => cancelOrder(order.id)}
                  disabled={updatingId === order.id}
                >
                  Cancelar pedido
                </button>
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


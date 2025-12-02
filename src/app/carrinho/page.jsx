"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CarrinhoPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setItems(cart);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const updateQty = (id, qty) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, qty) } : i));
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const total = useMemo(() => {
    return items.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0);
  }, [items]);

  const goCheckout = () => {
    if (items.length === 0) return;
    router.push('/checkout');
  };

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Seu Carrinho</h1>

        {items.length === 0 ? (
          <div className="card">
            <p style={{ color: 'var(--text-secondary)' }}>Seu carrinho está vazio.</p>
            <div style={{ marginTop: '1rem' }}>
              <a className="btn" href="/produtos">Ver produtos</a>
            </div>
          </div>
        ) : (
          <div className="grid grid-2">
            <div className="card">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {items.map((i) => (
                  <div key={i.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <img src={i.image} alt={i.name} style={{ width: 96, height: 72, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(0,255,255,0.2)' }} />
                    <div style={{ flex: 1 }}>
                      <strong>{i.name}</strong>
                      <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                        {typeof i.price === 'number' ? i.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ --'}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                        <label>Qtd</label>
                        <input
                          type="number"
                          min={1}
                          value={i.quantity}
                          onChange={(e) => updateQty(i.id, Number(e.target.value || 1))}
                          style={{
                            width: 80,
                            padding: '6px 10px',
                            borderRadius: 8,
                            border: '1px solid rgba(0,255,255,0.2)',
                            background: 'var(--background-darker)',
                            color: 'var(--text-primary)'
                          }}
                        />
                      </div>
                    </div>
                    <button className="btn btn-secondary" onClick={() => removeItem(i.id)}>Remover</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Resumo</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total</span>
                <strong>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
              </div>
              <button className="btn" onClick={goCheckout} disabled={items.length === 0}>Ir para Checkout</button>
              <a className="btn btn-secondary" href="/produtos">Continuar comprando</a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


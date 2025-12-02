"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ProdutoDetalhePage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/products/${id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Falha ao carregar o produto');
        const data = await res.json();
        setProduct(data);
      } catch (e) {
        console.error(e);
        setError('Produto não encontrado ou backend indisponível.');
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const addToCart = () => {
    if (!product) return;
    const existing = JSON.parse(localStorage.getItem('cart') || '[]');
    const idx = existing.findIndex((i) => i.id === product.id);
    if (idx >= 0) {
      existing[idx].quantity += qty;
    } else {
      existing.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: qty,
        image: (product.images && product.images[0]) || '/placeholder-product.png',
      });
    }
    localStorage.setItem('cart', JSON.stringify(existing));
    router.push('/carrinho');
  };

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <div className="card animate-glow" style={{ height: 320 }} />
        </div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="section">
        <div className="container">
          <div className="card" style={{ borderColor: '#ff0080' }}>
            <p style={{ color: '#ff8fb7' }}>{error || 'Produto não encontrado.'}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">{product.name}</h1>
        <div className="grid grid-2">
          <div className="card" style={{ minHeight: 320 }}>
            <img
              src={(product.images && product.images[0]) || '/placeholder-product.png'}
              alt={product.name}
              style={{ width: '100%', borderRadius: 8 }}
            />
          </div>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <strong style={{ fontSize: '1.4rem' }}>
              {typeof product.price === 'number'
                ? product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                : 'R$ --'}
            </strong>
            <p style={{ color: 'var(--text-secondary)' }}>{product.description}</p>
            {product.tags && product.tags.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {product.tags.map((t) => (
                  <span key={t} style={{
                    border: '1px solid rgba(0,255,255,0.2)',
                    borderRadius: 16,
                    padding: '4px 10px',
                    fontSize: 12,
                    color: 'var(--text-secondary)'
                  }}>{t}</span>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label>Quantidade</label>
              <input
                type="number"
                min={1}
                max={product.inStock || 99}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Math.min(Number(e.target.value || 1), product.inStock || 99)))}
                style={{
                  width: 100,
                  padding: '8px 10px',
                  borderRadius: 8,
                  border: '1px solid rgba(0,255,255,0.2)',
                  background: 'var(--background-darker)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button className="btn" onClick={addToCart}>Adicionar ao carrinho</button>
              <a className="btn btn-secondary" href="/produtos">Continuar comprando</a>
            </div>
            {typeof product.inStock === 'number' && (
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Estoque: {product.inStock}</p>
            )}
            {product.dimensions && (
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                Dimensões: {product.dimensions.width} x {product.dimensions.height} x {product.dimensions.depth}
              </p>
            )}
            {product.weight && (
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Peso: {product.weight} kg</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}


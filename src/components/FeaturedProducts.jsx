"use client";

import React, { useEffect, useState, useMemo } from 'react';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        if (!res.ok) throw new Error('Falha ao carregar produtos');
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data?.items || []);
        setProducts(list);
      } catch (e) {
        console.error(e);
        setError('Não foi possível carregar os produtos de destaque.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const featured = useMemo(() => {
    // Se houver tags de destaque no futuro, podemos filtrar. Por enquanto, mostra os 6 primeiros.
    return products.slice(0, 6);
  }, [products]);

  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">Produtos em Destaque</h2>

        {loading && (
          <div className="grid grid-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="card animate-glow" key={i} style={{ height: 220 }} />
            ))}
          </div>
        )}

        {error && (
          <div className="card" style={{ borderColor: '#ff0080' }}>
            <p style={{ color: '#ff8fb7' }}>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-3">
            {featured.map((p) => (
              <article className="card" key={p.id}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{
                    width: '100%',
                    aspectRatio: '4/3',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid rgba(0,255,255,0.2)'
                  }}>
                    <img
                      src={(p.images && p.images[0]) || '/placeholder-product.png'}
                      alt={p.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{p.name}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '1rem' }}>
                      {typeof p.price === 'number' ? p.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ --'}
                    </strong>
                    <a className="btn" href={`/produtos/${p.id}`}>Ver detalhes</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <a className="btn btn-secondary" href="/produtos">Ver todos os produtos</a>
        </div>
      </div>
    </section>
  );
}


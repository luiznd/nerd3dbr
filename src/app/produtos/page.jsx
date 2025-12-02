"use client";

import React, { useEffect, useMemo, useState } from 'react';

// Página de listagem de produtos
export default function ProdutosPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        if (!res.ok) throw new Error('Falha ao carregar produtos');
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : (data?.items || []));
      } catch (e) {
        console.error(e);
        setError('Não foi possível carregar os produtos. Verifique o backend ou tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const categories = useMemo(() => {
    const set = new Set();
    products.forEach(p => p?.category && set.add(p.category));
    return Array.from(set).sort();
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter(p => {
      const q = query.trim().toLowerCase();
      const matchesQuery = !q || `${p.name} ${p.description}`.toLowerCase().includes(q);
      const matchesCategory = !category || p.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [products, query, category]);

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Produtos</h1>

        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="grid grid-2">
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Buscar</label>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Nome, descrição, tags..."
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,255,255,0.2)',
                  background: 'var(--background-darker)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Categoria</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,255,255,0.2)',
                  background: 'var(--background-darker)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="">Todas</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

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
            {filtered.map((p) => (
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
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{p.name}</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>{p.description?.slice(0, 120)}{(p.description?.length || 0) > 120 ? '...' : ''}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '1.1rem' }}>
                      {typeof p.price === 'number' ? p.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ --'}
                    </strong>
                    <a className="btn" href={`/produtos/${p.id}`}>
                      Ver detalhes
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}


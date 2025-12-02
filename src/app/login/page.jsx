"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../presentation/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      router.push(redirect);
    } catch (err) {
      setError(err?.error || 'Falha ao autenticar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section">
      <div className="container" style={{maxWidth: '600px'}}>
        <div className="card" style={{margin: '0 auto'}}>
          <h1 className="section-title" style={{fontSize: '2rem', marginBottom: '1.5rem'}}>Entrar</h1>
          <form onSubmit={handleSubmit}>
            <div style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem'}}>E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                style={{width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(0,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: 'var(--text-primary)'}}
                placeholder="seuemail@exemplo.com"
                required
              />
            </div>
            <div style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem'}}>Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                style={{width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(0,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: 'var(--text-primary)'}}
                placeholder="******"
                required
              />
            </div>
            {error && (
              <div style={{marginBottom: '1rem', padding: '0.75rem', border: '1px solid rgba(255,0,80,0.5)', background: 'rgba(255,0,80,0.08)', color: '#ff8080', borderRadius: '8px'}}>
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn"
              style={{width: '100%', marginBottom: '0.75rem'}}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          <a href="/registrar" className="btn" style={{width: '100%', display: 'block', textAlign: 'center', marginTop: '0.5rem'}}>Registrar</a>
          <div style={{fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.75rem'}}>
            Dica: para acessar o admin rapidamente, faça login com o e-mail
            <strong style={{marginLeft: '0.25rem'}}>admin@nerd3dbr.dev</strong>.
          </div>
        </div>
      </div>
    </section>
  );
}

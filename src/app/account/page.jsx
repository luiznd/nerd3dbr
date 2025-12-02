"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../presentation/contexts/AuthContext';
import { apiClient } from '../../infrastructure/api/authApi';
import AddressFields from '../../presentation/components/ui/AddressFields';
import { Toaster, toast } from 'react-hot-toast';

export default function AccountPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/account');
    }
  }, [isAuthenticated, router]);

  async function ensureUserInStore() {
    try {
      if (!user?.email) return;
      const res = await apiClient.get(`/users?search=${encodeURIComponent(user.email)}`);
      const list = res.data;
      let u = Array.isArray(list) ? list.find((it) => it.email === user.email) : null;
      if (!u) {
        const createdRes = await apiClient.post('/users', { name: user.name || 'Novo Usuário', email: user.email, role: 'user' });
        u = createdRes.data;
      }
      setProfile(u || null);
    } catch (e) {
      console.error('Falha ao carregar perfil', e);
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      ensureUserInStore();
    }
  }, [isAuthenticated, user?.email]);

  if (!isAuthenticated || !profile) {
    return (
      <div className="container mx-auto p-8">
        <div className="animate-pulse h-8 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="animate-pulse h-32 bg-gray-200 rounded w-full max-w-md"></div>
      </div>
    );
  }

  return (
    <section className="section">
      <Toaster position="top-right" />
      <div className="container" style={{ maxWidth: '860px' }}>
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h1 className="section-title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Minha Conta</h1>
          <div style={{ color: 'var(--text-secondary)' }}>Bem-vindo(a), <strong style={{ color: 'var(--text-primary)' }}>{user?.name}</strong></div>
          <div style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{user?.email}</div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <a href="/account/orders" className="btn">Meus pedidos</a>
            <a href="/" className="btn btn-secondary">Voltar para Home</a>
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Completar perfil</h2>
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (!profile?.id) return;
            setSaving(true);
            try {
              const phoneDigits = String(profile.phone || '').replace(/\D/g, '');
              if (phoneDigits && phoneDigits.length < 10) {
                throw new Error('Telefone deve conter ao menos 10 dígitos');
              }
              const cepDigits = String(profile.cep || '').replace(/\D/g, '');
              if (cepDigits && cepDigits.length !== 8) {
                throw new Error('CEP deve conter 8 dígitos');
              }
              const uf = String(profile.addressState || '').trim().toUpperCase();
              if (uf && uf.length !== 2) {
                throw new Error('UF deve conter 2 letras');
              }
              const payload = {
                phone: phoneDigits,
                address: profile.address || '', // compatibilidade
                addressStreet: profile.addressStreet || '',
                addressNumber: profile.addressNumber || '',
                addressNeighborhood: profile.addressNeighborhood || '',
                addressCity: profile.addressCity || '',
                addressState: uf,
                addressComplement: profile.addressComplement || '',
                cep: cepDigits,
                country: profile.country || '',
              };
              const res = await apiClient.put(`/users/${profile.id}`, payload);
              const updated = res.data;
              setProfile(updated);
              toast.success('Perfil atualizado com sucesso!');
            } catch (err) {
              toast.error(err.message || 'Erro ao salvar');
            } finally {
              setSaving(false);
            }
          }}>
            <AddressFields
              profile={profile}
              setProfile={setProfile}
              phone={profile.phone}
              onPhoneChange={(v) => setProfile((p) => ({ ...p, phone: v }))}
              cep={profile.cep}
              onCepChange={(v) => setProfile((p) => ({ ...p, cep: v }))}
            />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
              <button type="submit" className="btn" disabled={saving}>{saving ? 'Salvando...' : 'Salvar perfil'}</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
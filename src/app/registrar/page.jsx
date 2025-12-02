"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { apiClient } from '../../infrastructure/api/authApi';
import { UserRegistrationSchema } from '../../lib/validations';
import AddressFields from '../../presentation/components/ui/AddressFields';
import { useAuth } from '../../presentation/contexts/AuthContext';

export default function RegistrarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { register, error } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Perfil do usuário, incluindo endereço
  const [profile, setProfile] = useState({
    phone: '',
    cep: '',
    addressStreet: '',
    addressNumber: '',
    addressNeighborhood: '',
    addressCity: '',
    addressState: '',
    addressComplement: '',
    country: 'Brasil',
  });

  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setValidationErrors({});

    const formData = {
      name,
      email,
      password,
      ...profile,
    };

    const validationResult = UserRegistrationSchema.safeParse(formData);

    if (!validationResult.success) {
      const errors = {};
      validationResult.error.errors.forEach(err => {
        errors[err.path[0]] = err.message;
      });
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const { phone, cep, addressState } = validationResult.data;
      const phoneDigits = String(phone || '').replace(/\D/g, '');
      const cepDigits = String(cep || '').replace(/\D/g, '');
      const uf = String(addressState || '').trim().toUpperCase();

      // Registra o usuário (gera token e usuário atual)
      const data = await register(name, email, password);

      // Cria perfil no store com os campos de endereço
      const composedAddress = [
        profile.addressStreet,
        profile.addressNeighborhood,
        profile.addressCity && `${profile.addressCity} - ${uf}`
      ]
        .filter(Boolean)
        .join(', ');
        
      await apiClient.post('/users', {
        name: data?.user?.name || name || 'Novo Usuário',
        email: data?.user?.email || email,
        role: 'user',
        phone: phoneDigits,
        address: composedAddress,
        addressStreet: profile.addressStreet,
        addressNumber: profile.addressNumber,
        addressNeighborhood: profile.addressNeighborhood,
        addressCity: profile.addressCity,
        addressState: uf,
        addressComplement: profile.addressComplement,
        cep: cepDigits,
        country: profile.country,
      });

      toast.success('Conta criada com sucesso! Redirecionando...');
      setTimeout(() => {
        router.push(redirect);
      }, 2000);

    } catch (err) {
      const errorMessage = err?.error || 'Falha ao registrar.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <Toaster position="top-right" />
      <div className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Criar conta</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6 }}>Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(0,255,255,0.2)',
                background: 'var(--background-darker)',
                color: 'var(--text-primary)'
              }}
            />
            {validationErrors.name && <div style={{ color: '#ff8fb7', fontSize: 12, marginTop: 4 }}>{validationErrors.name}</div>}
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6 }}>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(0,255,255,0.2)',
                background: 'var(--background-darker)',
                color: 'var(--text-primary)'
              }}
            />
            {validationErrors.email && <div style={{ color: '#ff8fb7', fontSize: 12, marginTop: 4 }}>{validationErrors.email}</div>}
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6 }}>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(0,255,255,0.2)',
                background: 'var(--background-darker)',
                color: 'var(--text-primary)'
              }}
            />
            {validationErrors.password && <div style={{ color: '#ff8fb7', fontSize: 12, marginTop: 4 }}>{validationErrors.password}</div>}
          </div>
          
          <AddressFields
            profile={profile}
            setProfile={setProfile}
            phone={profile.phone}
            onPhoneChange={(v) => setProfile((p) => ({ ...p, phone: v }))}
            cep={profile.cep}
            onCepChange={(v) => setProfile((p) => ({ ...p, cep: v }))}
            errors={validationErrors}
          />

          {error && (
            <div style={{ color: '#ff8fb7', fontSize: 13 }}>
              {error}
            </div>
          )}
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Criando...' : 'Criar conta'}
          </button>
          <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Já tem uma conta? <a href="/login" style={{ color: 'var(--text-accent)' }}>Entrar</a>
          </div>
        </form>
      </div>
    </div>
  );
}
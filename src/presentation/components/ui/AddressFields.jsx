'use client';

import { useEffect, useRef, useState } from 'react';

// Funções de máscara para CEP e Telefone
function formatCepView(v) {
  const d = String(v || '').replace(/\D/g, '').slice(0, 8);
  if (d.length > 5) return `${d.slice(0, 5)}-${d.slice(5)}`;
  return d;
}
function formatPhoneView(v) {
  const d = String(v || '').replace(/\D/g, '').slice(0, 11);
  if (d.length >= 10) {
    const dd = d.length === 11;
    const part1 = d.slice(0, 2);
    const part2 = dd ? d.slice(2, 7) : d.slice(2, 6);
    const part3 = dd ? d.slice(7) : d.slice(6);
    return `(${part1}) ${part2}-${part3}`;
  }
  return d;
}

/**
 * Componente reutilizável para campos de endereço com integração ViaCEP.
 * @param {{
 *   profile: object,
 *   setProfile: Function,
 *   phone: string,
 *   onPhoneChange: Function,
 *   cep: string,
 *   onCepChange: Function,
 *   // Opcional: props do react-hook-form
 *   register: Function,
 *   errors: object,
 *   setValue: Function,
 *   watch: Function,
 * }} props
 */
export default function AddressFields({
  profile,
  setProfile,
  phone,
  onPhoneChange,
  cep,
  onCepChange,
  // Opcional: props do react-hook-form
  register,
  errors,
  setValue,
  watch,
}) {
  const [viacepLoading, setViaCepLoading] = useState(false);
  const [viacepMsg, setViaCepMsg] = useState('');
  const [viacepErr, setViaCepErr] = useState('');
  const cepLookupTimer = useRef(null);

  // Observa o campo CEP do react-hook-form se disponível
  const watchedCep = watch ? watch('zipCode', cep) : cep;

  // Auto-preencher endereço via ViaCEP
  useEffect(() => {
    const digits = String(watchedCep || '').replace(/\D/g, '');
    setViaCepErr('');
    setViaCepMsg('');
    if (cepLookupTimer.current) {
      clearTimeout(cepLookupTimer.current);
    }
    if (!digits || digits.length !== 8) return;

    cepLookupTimer.current = setTimeout(async () => {
      try {
        setViaCepLoading(true);
        const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
        const data = await res.json();
        if (data?.erro) {
          setViaCepErr('CEP não encontrado');
          return;
        }
        
        const addressData = {
          addressStreet: data.logradouro || '',
          addressNeighborhood: data.bairro || '',
          addressCity: data.localidade || '',
          addressState: (data.uf || '').toUpperCase(),
          country: profile?.country || 'Brasil',
        };

        if (setValue) { // Se estiver usando react-hook-form
          setValue('street', addressData.addressStreet);
          setValue('neighborhood', addressData.addressNeighborhood);
          setValue('city', addressData.addressCity);
          setValue('state', addressData.addressState);
        } else if (setProfile) { // Se estiver usando useState
          setProfile((p) => ({ ...p, ...addressData }));
        }
        
        setViaCepMsg('Endereço preenchido automaticamente');
      } catch (e) {
        setViaCepErr('Falha ao consultar ViaCEP');
      } finally {
        setViaCepLoading(false);
      }
    }, 450);

    return () => {
      if (cepLookupTimer.current) {
        clearTimeout(cepLookupTimer.current);
      }
    };
  }, [watchedCep, setValue, setProfile, profile?.country]);

  // Helper para renderizar inputs
  const renderInput = (name, label, options = {}) => {
    const { mask, ...restOptions } = options;
    const isHookForm = !!register;
    
    const commonProps = {
      style: { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,255,255,0.2)', background: 'var(--background-darker)', color: 'var(--text-primary)' },
      ...restOptions,
    };

    const hookFormProps = isHookForm ? {
      ...register(name, options.validation),
      ...(errors && errors[name] ? { style: { ...commonProps.style, borderColor: '#ff8fb7' } } : {})
    } : {};

    const stateProps = !isHookForm ? {
      value: name === 'phone' ? formatPhoneView(phone) : (name === 'cep' ? formatCepView(cep) : profile?.[name] || ''),
      onChange: (e) => {
        if (name === 'phone') onPhoneChange(e.target.value.replace(/\D/g, ''));
        else if (name === 'cep') onCepChange(e.target.value.replace(/\D/g, ''));
        else setProfile((p) => ({ ...p, [name]: e.target.value }));
      }
    } : {};
    
    return (
      <div>
        <label style={{ display: 'block', marginBottom: 6 }}>{label}</label>
        <input {...commonProps} {...hookFormProps} {...stateProps} />
        {errors && errors[name] && (
          <p style={{ color: '#ff8fb7', fontSize: 13, marginTop: 4 }}>
            {isHookForm ? errors[name].message : errors[name]}
          </p>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
      {renderInput('phone', 'Telefone')}
      
      <div>
        {renderInput('cep', 'CEP', {
          validation: { required: 'CEP é obrigatório', minLength: { value: 8, message: 'CEP inválido' } },
          maxLength: 8
        })}
        {(viacepLoading || viacepErr || viacepMsg) && (
          <div style={{ marginTop: 6, fontSize: 13 }}>
            {viacepLoading && <span style={{ color: 'var(--text-secondary)' }}>Consultando CEP...</span>}
            {viacepErr && <span style={{ color: '#ff8fb7' }}>{viacepErr}</span>}
            {!viacepErr && viacepMsg && <span style={{ color: '#a6ffb9' }}>{viacepMsg}</span>}
          </div>
        )}
      </div>

      {renderInput('addressStreet', 'Logradouro', { validation: { required: 'Logradouro é obrigatório' } })}
      {renderInput('addressNumber', 'Número', { validation: { required: 'Número é obrigatório' } })}
      {renderInput('addressNeighborhood', 'Bairro', { validation: { required: 'Bairro é obrigatório' } })}
      {renderInput('addressCity', 'Cidade', { validation: { required: 'Cidade é obrigatória' } })}
      {renderInput('addressState', 'Estado', { 
        validation: { required: 'Estado é obrigatório', minLength: 2, maxLength: 2 },
        maxLength: 2
      })}
      {renderInput('addressComplement', 'Complemento')}
      
      <div>
        <label style={{ display: 'block', marginBottom: 6 }}>País</label>
        <select
          {...(register ? register('country') : {
            value: profile?.country || 'Brasil',
            onChange: (e) => setProfile((p) => ({ ...p, country: e.target.value }))
          })}
          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,255,255,0.2)', background: 'var(--background-darker)', color: 'var(--text-primary)' }}
        >
          <option>Brasil</option>
        </select>
      </div>
    </div>
  );
}
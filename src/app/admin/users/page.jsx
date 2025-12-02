"use client";

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../infrastructure/api/authApi';
import { useAuth } from '../../../presentation/contexts/AuthContext';

export default function AdminUsersPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [filterSearch, setFilterSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterBlocked, setFilterBlocked] = useState('');
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user', blocked: false });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/admin/users');
    } else if (!isAdmin) {
      router.push('/');
    }
  }, [isAuthenticated, isAdmin, router]);

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="container mx-auto p-8">
        <div className="animate-pulse h-8 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="animate-pulse h-32 bg-gray-200 rounded w-full max-w-md"></div>
      </div>
    );
  }

  async function loadUsers() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterSearch) params.append('search', filterSearch);
      if (filterRole) params.append('role', filterRole);
      if (filterBlocked) params.append('blocked', filterBlocked);
      const res = await apiClient.get(`/users${params.toString() ? `?${params.toString()}` : ''}`);
      const data = res.data;
      setUsers(Array.isArray(data) ? data : []);
      setError(null);
    } catch (e) {
      setError('Falha ao carregar usuários');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    try {
      const payload = {
        name: newUser.name.trim(),
        email: newUser.email.trim().toLowerCase(),
        role: newUser.role || 'user',
        blocked: !!newUser.blocked,
      };
      // Validações simples
      if (!payload.name) {
        setError('Nome é obrigatório');
        setCreating(false);
        return;
      }
      if (!payload.email || !payload.email.includes('@')) {
        setError('Email inválido');
        setCreating(false);
        return;
      }
      const res = await apiClient.post('/users', payload);
      const created = res.data;
      setUsers((prev) => [created, ...prev]);
      setNewUser({ name: '', email: '', role: 'user', blocked: false });
      setError(null);
    } catch (e) {
      setError('Erro ao criar usuário');
    } finally {
      setCreating(false);
    }
  }

  function startEdit(user) {
    setEditingId(user.id);
    setEditData({
      name: user.name,
      email: user.email,
      role: user.role,
      blocked: !!user.blocked,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditData({});
  }

  async function saveEdit(id) {
    try {
      const payload = {
        name: editData.name?.trim(),
        email: editData.email?.trim().toLowerCase(),
        role: editData.role || 'user',
        blocked: !!editData.blocked,
      };
      if (!payload.name) {
        setError('Nome é obrigatório');
        return;
      }
      if (!payload.email || !payload.email.includes('@')) {
        setError('Email inválido');
        return;
      }
      const res = await apiClient.put(`/users/${id}`, payload);
      const updated = res.data;
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
      setEditingId(null);
      setEditData({});
      setError(null);
    } catch (e) {
      setError('Erro ao salvar alterações');
    }
  }

  async function removeUser(id) {
    try {
      const res = await apiClient.delete(`/users/${id}`);
      if (res.status !== 200) throw new Error('Falha ao excluir');
      setUsers((prev) => prev.filter((u) => u.id !== id));
      if (editingId === id) cancelEdit();
      setError(null);
    } catch (e) {
      setError('Erro ao excluir usuário');
    }
  }

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
        <div className="text-sm text-gray-600">Total: {users.length}</div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end gap-3 mb-6 bg-white/50 p-4 rounded border">
        <div className="flex-1">
          <label className="block text-sm font-medium">Busca</label>
          <input
            className="mt-1 w-full border rounded px-2 py-1"
            placeholder="Digite nome ou email"
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">Role</label>
          <select
            className="mt-1 w-full border rounded px-2 py-1"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="">Todas</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">Bloqueado</label>
          <select
            className="mt-1 w-full border rounded px-2 py-1"
            value={filterBlocked}
            onChange={(e) => setFilterBlocked(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="true">Somente bloqueados</option>
            <option value="false">Somente ativos</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadUsers}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded border"
          >
            Aplicar Filtros
          </button>
          <button
            onClick={() => { setFilterSearch(''); setFilterRole(''); setFilterBlocked(''); loadUsers(); }}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded border"
          >
            Limpar
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 border border-red-300 bg-red-50 text-red-700 rounded">{error}</div>
      )}

      {/* Formulário de criação */}
      <form onSubmit={handleCreate} className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/50 p-4 rounded border">
        <div>
          <label className="block text-sm font-medium">Nome</label>
          <input
            className="mt-1 w-full border rounded px-2 py-1"
            value={newUser.name}
            onChange={(e) => setNewUser((u) => ({ ...u, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="mt-1 w-full border rounded px-2 py-1"
            value={newUser.email}
            onChange={(e) => setNewUser((u) => ({ ...u, email: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Role</label>
          <select
            className="mt-1 w-full border rounded px-2 py-1"
            value={newUser.role}
            onChange={(e) => setNewUser((u) => ({ ...u, role: e.target.value }))}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="md:col-span-3 flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={newUser.blocked}
              onChange={(e) => setNewUser((u) => ({ ...u, blocked: e.target.checked }))}
            />
            Bloqueado
          </label>
          <button
            type="submit"
            disabled={creating}
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {creating ? 'Criando...' : 'Criar Usuário'}
          </button>
        </div>
      </form>

      {/* Lista de usuários */}
      <div className="overflow-x-auto bg-white/50 rounded border">
        <table className="w-full min-w-[1200px] text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left font-semibold">Nome</th>
              <th className="p-3 text-left font-semibold">Email</th>
              <th className="p-3 text-left font-semibold">Role</th>
              <th className="p-3 text-left font-semibold">Telefone</th>
              <th className="p-3 text-left font-semibold">CEP</th>
              <th className="p-3 text-left font-semibold">Logradouro</th>
              <th className="p-3 text-left font-semibold">Cidade</th>
              <th className="p-3 text-left font-semibold">UF</th>
              <th className="p-3 text-left font-semibold">Status</th>
              <th className="p-3 text-left font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan="10" className="p-4 text-center">Carregando...</td></tr>
            )}
            {!loading && users.length === 0 && (
              <tr><td colSpan="10" className="p-4 text-center">Nenhum usuário encontrado</td></tr>
            )}
            {!loading && users.map((u) => (
              <React.Fragment key={u.id}>
                {editingId === u.id ? (
                  <tr className="border-b bg-gray-50">
                    <td colSpan="10" className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
                        <div>
                          <label className="block text-sm font-medium">Nome</label>
                          <input
                            className="mt-1 w-full border rounded px-2 py-1"
                            value={editData.name || ''}
                            onChange={(e) => setEditData((d) => ({ ...d, name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">Email</label>
                          <input
                            type="email"
                            className="mt-1 w-full border rounded px-2 py-1"
                            value={editData.email || ''}
                            onChange={(e) => setEditData((d) => ({ ...d, email: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">Role</label>
                          <select
                            className="mt-1 w-full border rounded px-2 py-1"
                            value={editData.role || 'user'}
                            onChange={(e) => setEditData((d) => ({ ...d, role: e.target.value }))}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                        <div className="md:col-span-3 flex items-center gap-3">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={!!editData.blocked}
                              onChange={(e) => setEditData((d) => ({ ...d, blocked: e.target.checked }))}
                            />
                            Bloqueado
                          </label>
                          <div className="ml-auto flex gap-2">
                            <button
                              onClick={() => saveEdit(u.id)}
                              className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              Salvar
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded border"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{u.name}</td>
                    <td className="p-3 text-gray-600">{u.email}</td>
                    <td className="p-3">{u.role}</td>
                    <td className="p-3">{u.phone || '-'}</td>
                    <td className="p-3">{u.cep || '-'}</td>
                    <td className="p-3">{u.addressStreet || '-'}</td>
                    <td className="p-3">{u.addressCity || '-'}</td>
                    <td className="p-3">{u.addressState || '-'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.blocked ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                        {u.blocked ? 'Bloqueado' : 'Ativo'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => startEdit(u)}
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded border"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => removeUser(u.id)}
                          className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

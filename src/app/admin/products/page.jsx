"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../presentation/contexts/AuthContext';

export default function AdminProductsPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    inStock: '',
    isDigital: false,
    fileUrl: '',
    tags: '', // comma-separated
    images: '', // comma-separated URLs
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/admin/products');
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

  async function loadProducts() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterCategory) params.append('category', filterCategory);
      if (filterQuery) params.append('q', filterQuery);
      const res = await fetch(`/api/products${params.toString() ? `?${params.toString()}` : ''}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
      setError(null);
    } catch (e) {
      setError('Falha ao carregar produtos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    try {
      const payload = {
        name: newProduct.name.trim(),
        description: newProduct.description.trim(),
        price: parseFloat(newProduct.price || '0'),
        category: newProduct.category.trim() || 'Outros',
        inStock: parseInt(newProduct.inStock || '0', 10),
        isDigital: !!newProduct.isDigital,
        fileUrl: newProduct.fileUrl?.trim() || undefined,
        tags: newProduct.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        images: newProduct.images
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };
      // Validações simples
      if (!payload.name) {
        setError('Nome é obrigatório');
        setCreating(false);
        return;
      }
      if (isNaN(payload.price) || payload.price <= 0) {
        setError('Preço deve ser um número maior que 0');
        setCreating(false);
        return;
      }
      if (isNaN(payload.inStock) || payload.inStock < 0) {
        setError('Estoque deve ser um número inteiro maior ou igual a 0');
        setCreating(false);
        return;
      }
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Falha ao criar');
      const created = await res.json();
      setProducts((prev) => [created, ...prev]);
      setNewProduct({ name: '', description: '', price: '', category: '', inStock: '', isDigital: false, fileUrl: '', tags: '', images: '' });
      setError(null);
    } catch (e) {
      setError('Erro ao criar produto');
    } finally {
      setCreating(false);
    }
  }

  function startEdit(product) {
    setEditingId(product.id);
    setEditData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category || '',
      inStock: product.inStock ?? 0,
      isDigital: !!product.isDigital,
      fileUrl: product.fileUrl || '',
      tags: (product.tags || []).join(', '),
      images: (product.images || []).join(', '),
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
        description: editData.description?.trim(),
        price: parseFloat(editData.price),
        category: editData.category?.trim() || 'Outros',
        inStock: parseInt(editData.inStock, 10),
        isDigital: !!editData.isDigital,
        fileUrl: editData.fileUrl?.trim() || undefined,
        tags: (editData.tags || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        images: (editData.images || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Falha ao salvar');
      const updated = await res.json();
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      setEditingId(null);
      setEditData({});
      setError(null);
    } catch (e) {
      setError('Erro ao salvar alterações');
    }
  }

  async function removeProduct(id) {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Falha ao excluir');
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (editingId === id) cancelEdit();
      setError(null);
    } catch (e) {
      setError('Erro ao excluir produto');
    }
  }

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Gerenciar Produtos</h1>
        <div className="text-sm text-gray-600">Total: {products.length}</div>
      </div>
      <div className="flex flex-col md:flex-row md:items-end gap-3 mb-6 bg-white/50 p-4 rounded border">
        <div className="flex-1">
          <label className="block text-sm font-medium">Categoria</label>
          <input
            className="mt-1 w-full border rounded px-2 py-1"
            placeholder="ex.: Action Figures, Decoração, Logos"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">Busca</label>
          <input
            className="mt-1 w-full border rounded px-2 py-1"
            placeholder="Digite um nome, descrição ou tag"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadProducts}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded border"
          >
            Aplicar Filtros
          </button>
          <button
            onClick={() => { setFilterCategory(''); setFilterQuery(''); loadProducts(); }}
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
            value={newProduct.name}
            onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Preço (R$)</label>
          <input
            type="number"
            step="0.01"
            className="mt-1 w-full border rounded px-2 py-1"
            value={newProduct.price}
            onChange={(e) => setNewProduct((p) => ({ ...p, price: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Categoria</label>
          <input
            className="mt-1 w-full border rounded px-2 py-1"
            value={newProduct.category}
            onChange={(e) => setNewProduct((p) => ({ ...p, category: e.target.value }))}
          />
        </div>
        <div className="md:col-span-3">
          <label className="block text-sm font-medium">Descrição</label>
          <textarea
            className="mt-1 w-full border rounded px-2 py-1"
            value={newProduct.description}
            onChange={(e) => setNewProduct((p) => ({ ...p, description: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Estoque</label>
          <input
            type="number"
            className="mt-1 w-full border rounded px-2 py-1"
            value={newProduct.inStock}
            onChange={(e) => setNewProduct((p) => ({ ...p, inStock: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Digital?</label>
          <input
            type="checkbox"
            className="mt-2"
            checked={newProduct.isDigital}
            onChange={(e) => setNewProduct((p) => ({ ...p, isDigital: e.target.checked }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">URL do Arquivo (se digital)</label>
          <input
            className="mt-1 w-full border rounded px-2 py-1"
            value={newProduct.fileUrl}
            onChange={(e) => setNewProduct((p) => ({ ...p, fileUrl: e.target.value }))}
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Tags (separadas por vírgula)</label>
          <input
            className="mt-1 w-full border rounded px-2 py-1"
            value={newProduct.tags}
            onChange={(e) => setNewProduct((p) => ({ ...p, tags: e.target.value }))}
            placeholder="ex.: anime, marvel"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Imagens (URLs separados por vírgula)</label>
          <input
            className="mt-1 w-full border rounded px-2 py-1"
            value={newProduct.images}
            onChange={(e) => setNewProduct((p) => ({ ...p, images: e.target.value }))}
            placeholder="ex.: /gallery/xyz.jpg, https://..."
          />
        </div>
        <div className="md:col-span-3">
          <button
            type="submit"
            disabled={creating}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            {creating ? 'Criando...' : 'Criar Produto'}
          </button>
        </div>
      </form>

      {/* Lista de produtos */}
      <div className="bg-white/50 border rounded">
        <div className="grid grid-cols-12 gap-2 px-4 py-2 font-semibold border-b bg-gray-50">
          <div className="col-span-3">Nome</div>
          <div className="col-span-2">Categoria</div>
          <div className="col-span-2">Preço</div>
          <div className="col-span-2">Estoque</div>
          <div className="col-span-3 text-right">Ações</div>
        </div>

        {loading ? (
          <div className="p-4">Carregando...</div>
        ) : products.length === 0 ? (
          <div className="p-4">Nenhum produto encontrado.</div>
        ) : (
          products.map((p) => (
            <div key={p.id} className="grid grid-cols-12 gap-2 px-4 py-3 border-b">
              <div className="col-span-3">
                {editingId === p.id ? (
                  <input
                    className="w-full border rounded px-2 py-1"
                    value={editData.name}
                    onChange={(e) => setEditData((d) => ({ ...d, name: e.target.value }))}
                  />
                ) : (
                  <div className="font-medium">{p.name}</div>
                )}
                <div className="text-xs text-gray-500 truncate">{p.description}</div>
              </div>
              <div className="col-span-2">
                {editingId === p.id ? (
                  <input
                    className="w-full border rounded px-2 py-1"
                    value={editData.category}
                    onChange={(e) => setEditData((d) => ({ ...d, category: e.target.value }))}
                  />
                ) : (
                  p.category || '—'
                )}
              </div>
              <div className="col-span-2">
                {editingId === p.id ? (
                  <input
                    type="number"
                    step="0.01"
                    className="w-full border rounded px-2 py-1"
                    value={editData.price}
                    onChange={(e) => setEditData((d) => ({ ...d, price: e.target.value }))}
                  />
                ) : (
                  `R$ ${Number(p.price).toFixed(2)}`
                )}
              </div>
              <div className="col-span-2">
                {editingId === p.id ? (
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1"
                    value={editData.inStock}
                    onChange={(e) => setEditData((d) => ({ ...d, inStock: e.target.value }))}
                  />
                ) : (
                  p.inStock ?? 0
                )}
              </div>
              <div className="col-span-3 text-right">
                {editingId === p.id ? (
                  <div className="space-x-2">
                    <button
                      onClick={() => saveEdit(p.id)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="space-x-2">
                    <button
                      onClick={() => startEdit(p)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => removeProduct(p.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                    >
                      Excluir
                    </button>
                  </div>
                )}
              </div>
              {editingId === p.id && (
                <div className="col-span-12 mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 bg-gray-50 p-3 rounded">
                  <div>
                    <label className="block text-xs font-medium">Descrição</label>
                    <textarea
                      className="mt-1 w-full border rounded px-2 py-1"
                      value={editData.description}
                      onChange={(e) => setEditData((d) => ({ ...d, description: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium">Tags (vírgula)</label>
                    <input
                      className="mt-1 w-full border rounded px-2 py-1"
                      value={editData.tags}
                      onChange={(e) => setEditData((d) => ({ ...d, tags: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium">Imagens (URLs, vírgula)</label>
                    <input
                      className="mt-1 w-full border rounded px-2 py-1"
                      value={editData.images}
                      onChange={(e) => setEditData((d) => ({ ...d, images: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium">Digital?</label>
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={!!editData.isDigital}
                      onChange={(e) => setEditData((d) => ({ ...d, isDigital: e.target.checked }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium">URL do Arquivo</label>
                    <input
                      className="mt-1 w-full border rounded px-2 py-1"
                      value={editData.fileUrl}
                      onChange={(e) => setEditData((d) => ({ ...d, fileUrl: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

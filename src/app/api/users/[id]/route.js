import { NextResponse } from 'next/server';
import { findUserById, updateUserById, deleteUserById } from '../../_usersStore';

export async function GET(req, { params }) {
  try {
    const { id } = params || {};
    const authHeader = req.headers.get('authorization') || '';
    const requesterRole = (req.headers.get('x-user-role') || '').toLowerCase();
    const requesterId = (req.headers.get('x-user-id') || '').toString();
    if (!authHeader) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    const isAdmin = requesterRole === 'admin';
    const isSelf = requesterId === id;
    if (!isAdmin && !isSelf) {
      return NextResponse.json({ error: 'Proibido' }, { status: 403 });
    }
    const user = findUserById(id);
    if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json({ error: e?.message || 'Falha ao obter usuário' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = params || {};
    const authHeader = req.headers.get('authorization') || '';
    const requesterRole = (req.headers.get('x-user-role') || '').toLowerCase();
    const requesterId = (req.headers.get('x-user-id') || '').toString();
    if (!authHeader) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    const isAdmin = requesterRole === 'admin';
    const isSelf = requesterId === id;
    if (!isAdmin && !isSelf) {
      return NextResponse.json({ error: 'Proibido' }, { status: 403 });
    }
    const patch = await req.json();
    if (typeof patch?.email !== 'undefined') {
      const email = String(patch.email || '').trim();
      if (!email || !email.includes('@')) {
        return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
      }
      patch.email = email.toLowerCase();
    }
    if (typeof patch?.name !== 'undefined') {
      const name = String(patch.name || '').trim();
      if (!name) {
        return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
      }
      patch.name = name;
    }
    if (typeof patch?.role !== 'undefined') {
      patch.role = String(patch.role || 'user');
    }
    if (typeof patch?.blocked !== 'undefined') {
      patch.blocked = !!patch.blocked;
    }
    if (typeof patch?.phone !== 'undefined') {
      patch.phone = String(patch.phone || '').trim();
    }
    if (typeof patch?.address !== 'undefined') {
      patch.address = String(patch.address || '').trim();
    }
    if (typeof patch?.addressStreet !== 'undefined') {
      patch.addressStreet = String(patch.addressStreet || '').trim();
    }
    if (typeof patch?.addressNumber !== 'undefined') {
      patch.addressNumber = String(patch.addressNumber || '').trim();
    }
    if (typeof patch?.addressNeighborhood !== 'undefined') {
      patch.addressNeighborhood = String(patch.addressNeighborhood || '').trim();
    }
    if (typeof patch?.addressCity !== 'undefined') {
      patch.addressCity = String(patch.addressCity || '').trim();
    }
    if (typeof patch?.addressState !== 'undefined') {
      const uf = String(patch.addressState || '').trim().toUpperCase();
      if (uf && uf.length !== 2) {
        return NextResponse.json({ error: 'UF deve conter 2 letras' }, { status: 400 });
      }
      patch.addressState = uf;
    }
    if (typeof patch?.addressComplement !== 'undefined') {
      patch.addressComplement = String(patch.addressComplement || '').trim();
    }
    if (typeof patch?.cep !== 'undefined') {
      const cep = String(patch.cep || '').replace(/\D/g, '');
      if (cep && cep.length !== 8) {
        return NextResponse.json({ error: 'CEP deve conter 8 dígitos' }, { status: 400 });
      }
      patch.cep = cep;
    }
    if (typeof patch?.country !== 'undefined') {
      patch.country = String(patch.country || '').trim();
    }
    const updated = updateUserById(id, patch);
    if (!updated) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (e) {
    if (e?.code === 'EMAIL_EXISTS') {
      return NextResponse.json({ error: 'Email já existe' }, { status: 400 });
    }
    return NextResponse.json({ error: e?.message || 'Falha ao atualizar usuário' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params || {};
    const authHeader = req.headers.get('authorization') || '';
    const requesterRole = (req.headers.get('x-user-role') || '').toLowerCase();
    if (!authHeader) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    const isAdmin = requesterRole === 'admin';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Proibido' }, { status: 403 });
    }
    const ok = deleteUserById(id);
    if (!ok) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e?.message || 'Falha ao excluir usuário' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { listUsers, addUser } from '../_usersStore';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || searchParams.get('q') || '';
    const role = searchParams.get('role') || '';
    const blocked = searchParams.get('blocked');

    // Autorização simples via cabeçalhos (ambiente dev)
    const authHeader = req.headers.get('authorization') || '';
    const requesterRole = (req.headers.get('x-user-role') || '').toLowerCase();
    const requesterEmail = (req.headers.get('x-user-email') || '').toLowerCase();
    if (!authHeader) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const isAdmin = requesterRole === 'admin';
    if (isAdmin) {
      const users = listUsers({ search, role, blocked });
      return NextResponse.json(users);
    }

    // Usuário comum: só pode buscar por si mesmo (via email)
    if (!search || search.toLowerCase() !== requesterEmail) {
      return NextResponse.json([], { status: 200 });
    }
    const users = listUsers({ search: requesterEmail, role, blocked });
    // Retorna apenas o próprio usuário
    return NextResponse.json(Array.isArray(users) ? users.filter(u => (u.email || '').toLowerCase() === requesterEmail) : []);
  } catch (e) {
    return NextResponse.json({ error: e?.message || 'Falha ao listar usuários' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    // Autorização simples via cabeçalhos (ambiente dev)
    const authHeader = req.headers.get('authorization') || '';
    const requesterRole = (req.headers.get('x-user-role') || '').toLowerCase();
    const requesterEmail = (req.headers.get('x-user-email') || '').toLowerCase();
    if (!authHeader) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const body = await req.json();
    const name = String(body?.name || '').trim();
    const email = String(body?.email || '').trim().toLowerCase();
    const role = String(body?.role || 'user');
    const blocked = !!body?.blocked;
    const phone = String(body?.phone || '').trim();
    const address = String(body?.address || '').trim();
    const addressStreet = String(body?.addressStreet || '').trim();
    const addressNumber = String(body?.addressNumber || '').trim();
    const addressNeighborhood = String(body?.addressNeighborhood || '').trim();
    const addressCity = String(body?.addressCity || '').trim();
    const addressState = String(body?.addressState || '').trim();
    const addressComplement = String(body?.addressComplement || '').trim();
    const cep = String(body?.cep || '').trim();
    const country = String(body?.country || '').trim();

    // Admin pode criar qualquer usuário. Usuário comum só pode criar a si mesmo (para completar perfil inicial)
    const isAdmin = requesterRole === 'admin';
    const isSelfCreate = requesterEmail && requesterEmail === email;
    if (!isAdmin && !isSelfCreate) {
      return NextResponse.json({ error: 'Proibido' }, { status: 403 });
    }

    if (!name) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
    }
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }
    const created = addUser({
      name,
      email,
      role,
      blocked,
      phone,
      address,
      addressStreet,
      addressNumber,
      addressNeighborhood,
      addressCity,
      addressState,
      addressComplement,
      cep,
      country,
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    if (e?.code === 'EMAIL_EXISTS') {
      return NextResponse.json({ error: 'Email já existe' }, { status: 400 });
    }
    return NextResponse.json({ error: e?.message || 'Falha ao criar usuário' }, { status: 500 });
  }
}

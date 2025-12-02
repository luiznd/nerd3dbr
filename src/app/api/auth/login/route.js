import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body || {};
    const normalized = String(email || '').toLowerCase();
    const isAdmin = normalized === 'admin@nerd3dbr.dev' || normalized.includes('admin');
    const user = {
      id: 'u-dev-001',
      name: isAdmin ? 'Admin Dev' : 'Usuário Dev',
      email: normalized || 'dev@example.com',
      role: isAdmin ? 'admin' : 'user',
    };
    return NextResponse.json({ token: 'dev-token', user });
  } catch (e) {
    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 400 });
  }
}

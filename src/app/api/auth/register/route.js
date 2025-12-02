import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email } = body || {};
    const normalized = String(email || '').toLowerCase();
    const user = {
      id: 'u-dev-002',
      name: name || 'Novo Usuário',
      email: normalized || 'user@example.com',
      role: 'user',
    };
    return NextResponse.json({ token: 'dev-token', user });
  } catch (e) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  }
}

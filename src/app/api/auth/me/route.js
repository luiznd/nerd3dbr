import { NextResponse } from 'next/server';

export async function GET(request) {
  // Em ambiente de desenvolvimento, retornamos um usuário genérico com role
  return NextResponse.json({ user: { id: 'u-dev-001', name: 'Usuário Dev', email: 'dev@example.com', role: 'user' } });
}

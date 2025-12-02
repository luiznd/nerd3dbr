import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = params || {};
  if (!id) {
    return NextResponse.json({ error: 'ID ausente' }, { status: 400 });
  }
  // Sempre retorna aprovado em dev
  return NextResponse.json({ id, status: 'approved' });
}


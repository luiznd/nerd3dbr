import { NextResponse } from 'next/server';
import initial, { findOrderById } from '../../_store';

export async function GET(request, { params }) {
  const { id } = params || {};
  if (!id) {
    return NextResponse.json({ error: 'ID do pedido ausente' }, { status: 400 });
  }
  const found = findOrderById(id);
  if (!found) {
    return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
  }
  return NextResponse.json(found);
}

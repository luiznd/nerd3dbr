import { NextResponse } from 'next/server';
import initial, { findOrderById, saveStore } from '../../../_store';

export async function PATCH(request, { params }) {
  const { id } = params || {};
  if (!id) {
    return NextResponse.json({ error: 'ID do pedido ausente' }, { status: 400 });
  }
  try {
    const { status } = await request.json();
    const order = findOrderById(id);
    if (!order) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
    }
    order.status = status || order.status;
    order.updatedAt = new Date().toISOString();
    saveStore();
    return NextResponse.json(order);
  } catch (e) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  }
}

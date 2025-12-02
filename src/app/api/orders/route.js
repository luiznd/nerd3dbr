import { NextResponse } from 'next/server';
import initial, { addOrder, getStore } from '../_store';

export async function POST(request) {
  try {
    const body = await request.json();
    const id = `ord-${Date.now()}`;
    const order = {
      id,
      ...body,
      status: 'created',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addOrder(order);
    return NextResponse.json(order, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Não foi possível criar o pedido' }, { status: 400 });
  }
}

export async function GET() {
  // Lista pedidos criados durante a sessão de desenvolvimento
  return NextResponse.json(getStore().orders);
}

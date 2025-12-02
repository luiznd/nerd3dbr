import { NextResponse } from 'next/server';
import { listProducts, addProduct } from '../_productsStore';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || '';
  const q = (searchParams.get('q') || '').toLowerCase();
  const list = listProducts({ category, q });
  return NextResponse.json(list);
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body?.name || typeof body.price === 'undefined') {
      return NextResponse.json({ error: 'Nome e preço são obrigatórios' }, { status: 400 });
    }
    const created = addProduct(body);
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Falha ao criar produto' }, { status: 500 });
  }
}

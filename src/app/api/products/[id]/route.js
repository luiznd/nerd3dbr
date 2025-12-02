import { NextResponse } from 'next/server';
import { findProductById, updateProductById, deleteProductById } from '../../_productsStore';

export async function GET(request, { params }) {
  const { id } = params || {};
  const product = findProductById(id);
  if (!product) {
    return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PUT(request, { params }) {
  try {
    const { id } = params || {};
    const patch = await request.json();
    const updated = updateProductById(id, patch);
    if (!updated) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: 'Falha ao atualizar produto' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params || {};
    const removed = deleteProductById(id);
    if (!removed) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Falha ao excluir produto' }, { status: 500 });
  }
}

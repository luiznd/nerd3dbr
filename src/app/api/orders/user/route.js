import { NextResponse } from 'next/server';
import store from '../../_store';

export async function GET(request) {
  // Em dev, retornamos todos os pedidos; em produção, filtraríamos pelo usuário
  // Poderíamos extrair o usuário do token (Authorization), mas mantemos simples aqui
  return NextResponse.json(store.orders);
}


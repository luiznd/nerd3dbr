import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const id = `pay-${Date.now()}`;
    return NextResponse.json({
      id,
      status: 'approved',
      detail: 'Pagamento processado (mock)'
    });
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao processar pagamento' }, { status: 400 });
  }
}


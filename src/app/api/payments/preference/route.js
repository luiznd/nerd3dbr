import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const id = `pref-${Date.now()}`;
    // Retorna uma preferência mock
    return NextResponse.json({
      id,
      init_point: `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${id}`,
      sandbox_init_point: `https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=${id}`,
    }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao criar preferência' }, { status: 400 });
  }
}


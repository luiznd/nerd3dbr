import { NextResponse } from 'next/server';

// Esta rota simula uma chamada de teste para o backend
export async function GET() {
  try {
    // URL do backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    
    // Faz uma chamada para o endpoint de health check do backend
    const response = await fetch(`${backendUrl}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Backend respondeu com status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json({
      status: 'success',
      message: 'Conexão com backend estabelecida com sucesso',
      backendResponse: data
    });
  } catch (error) {
    console.error('Erro ao testar conexão com backend:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Falha na conexão com backend',
      error: error.message
    }, { status: 500 });
  }
}
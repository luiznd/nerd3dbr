"use client";

import React from 'react';
import Contact from '../../components/Contact';

export default function ContatoPage() {
  return (
    <main>
      <section className="section">
        <div className="container">
          <h1 className="section-title">Fale Conosco</h1>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem' }}>
            Tire suas dúvidas, solicite orçamentos e acompanhe seus pedidos.
          </p>
        </div>
      </section>
      <Contact />
    </main>
  );
}


# Guia de Migração para Next.js 14

## Passos para Migração

1. **Instalar Next.js e dependências**
   ```bash
   # Renomear package.json atual para backup
   mv package.json package.vite.json
   
   # Renomear novo package para uso
   mv package.next.json package.json
   
   # Instalar dependências
   npm install
   ```

2. **Estrutura de Diretórios**
   - Criar estrutura App Router:
     ```
     src/
     ├── app/
     │   ├── (auth)/
     │   │   ├── login/page.tsx
     │   │   └── register/page.tsx
     │   ├── (shop)/
     │   │   ├── products/[id]/page.tsx
     │   │   └── products/page.tsx
     │   ├── api/
     │   │   └── route.ts
     │   ├── layout.tsx
     │   └── page.tsx
     ├── components/
     │   ├── ui/
     │   └── layout/
     └── lib/
         ├── api/
         └── hooks/
     ```

3. **Migrar Componentes**
   - Converter componentes React para Server/Client Components
   - Adicionar diretiva `'use client'` para componentes com interatividade

4. **Configurar API Routes**
   - Criar handlers em `app/api/`
   - Implementar autenticação JWT

5. **Configurar Variáveis de Ambiente**
   - Criar `.env.local` com:
     ```
     NEXT_PUBLIC_API_URL=http://localhost:8080
     NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=TEST-your-public-key
     ```

## Benefícios da Migração

- **Melhor SEO** com Server Components
- **Melhor Performance** com App Router e streaming
- **Rotas Dinâmicas** mais simples
- **Integração com Vercel** otimizada

## Próximos Passos

1. Migrar componentes existentes
2. Implementar autenticação JWT
3. Integrar Mercado Pago
4. Configurar deploy no Vercel
# Estratégia de Deploy - Nerd3D BR

## Visão Geral

O projeto Nerd3D BR utiliza uma estratégia de deploy híbrida:
- **Frontend**: Deploy no Vercel para melhor performance e CDN global
- **Backend e Serviços**: Containers Docker em VPS para maior controle e flexibilidade

## Configuração do Backend (Docker)

### Requisitos
- Docker e Docker Compose instalados
- Acesso à VPS para deploy em produção

### Comandos para Ambiente de Desenvolvimento
```bash
# Iniciar todos os serviços de backend
docker-compose -f docker-compose.backend.yml up

# Iniciar em modo detached (background)
docker-compose -f docker-compose.backend.yml up -d

# Parar todos os serviços
docker-compose -f docker-compose.backend.yml down

# Reconstruir imagens
docker-compose -f docker-compose.backend.yml build
```

### Serviços Disponíveis
- **Backend API**: http://localhost:8080
- **MongoDB**: mongodb://localhost:27017
- **Redis**: redis://localhost:6379
- **RabbitMQ Admin**: http://localhost:15672 (usuário: guest, senha: guest)

## Configuração do Frontend (Vercel)

### Requisitos
- Conta no Vercel
- Node.js e npm instalados localmente para desenvolvimento

### Desenvolvimento Local
```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

### Deploy no Vercel
1. Conecte seu repositório GitHub ao Vercel
2. Configure as variáveis de ambiente:
   - `VITE_API_URL`: URL da API em produção (ex: https://api.nerd3dbr.com)
   - `VITE_MERCADO_PAGO_PUBLIC_KEY`: Chave pública do Mercado Pago

3. Deploy automático a cada push na branch principal

### Comandos para Deploy Manual
```bash
# Instalar Vercel CLI
npm install -g vercel

# Login no Vercel
vercel login

# Deploy para produção
vercel --prod
```

## Próximos Passos

1. Migrar o frontend para Next.js 14 com App Router
2. Implementar autenticação JWT entre frontend e backend
3. Integrar Mercado Pago no frontend

## Notas Importantes

- O backend em Docker deve estar configurado para aceitar requisições CORS do frontend no Vercel
- As variáveis de ambiente devem ser configuradas corretamente em ambos os ambientes
- Para produção, utilize certificados SSL para comunicação segura entre frontend e backend
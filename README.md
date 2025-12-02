# Nerd 3D BR – Frontend (Next.js)

Projeto frontend do site Nerd 3D BR, baseado em Next.js (App Router) com rotas de API simuladas para desenvolvimento. Inclui páginas públicas, login/registro, perfil de usuário com validações e máscaras, integração ViaCEP para autocompletar endereço via CEP, e páginas administrativas com proteção por role.

Resumo do que está implementado
- Layout unificado com classes section, container e card.
- Menu sem o botão “Registrar” (o fluxo de registro fica na página de login/registrar).
- Login/Registro (mock): retorna um token “dev-token” e um objeto user com role (admin ou user).
- AuthContext expõe isAuthenticated, user e isAdmin, usados nas páginas protegidas.
- Páginas protegidas: /admin/users e /admin/products exigem login e role admin.
- Perfil (/account): edição de telefone, CEP, endereço e país, com máscaras e validações simples.
- ViaCEP: quando o CEP tem 8 dígitos, a página consulta automaticamente e preenche o endereço como “logradouro, bairro, cidade - UF”.
- API de usuários com proteção simples usando cabeçalhos (Authorization + X-User-Id/Email/Role) via interceptor do axios.

Requisitos
- Node.js 18+ (Next.js 14 é compatível com Node 18 ou superior).
- npm 9+ (ou pnpm/yarn, se preferir adaptar).

Instalação
1. npm install
2. npm run dev
   - Servidor local: http://localhost:3000
   - Você pode alterar a porta: npm run dev -- -p 3002

Build e produção
- npm run build
- npm run start
- Por padrão: http://localhost:3000

Estrutura do projeto (principais)
- src/app: páginas e rotas de API (App Router)
  - /login, /registrar, /account, /admin/users, /admin/products
  - /api: rotas de API simuladas (auth, users, products, etc.)
- src/infrastructure/api/authApi.js: cliente axios (apiClient) com interceptors
- src/presentation/contexts/AuthContext.jsx: contexto de autenticação
- src/components: componentes de layout e UI (Header, Footer, Hero, etc.)

Autenticação e cabeçalhos
- Login de admin: use um e-mail que contenha “admin” (ex.: admin@nerd3dbr.dev) — o backend simulado atribui role “admin”.
- Após login/registro:
  - localStorage: auth_token = "dev-token"
  - localStorage: user = { id, name, email, role }
- Interceptor do apiClient (axios) envia em todas as requisições:
  - Authorization: Bearer dev-token
  - X-User-Id, X-User-Email, X-User-Role (do usuário logado)

Rotas de autenticação (mock)
- POST /api/auth/login
  - Body: { email, password }
  - Retorno: { token: "dev-token", user: { id, name, email, role } }
- POST /api/auth/register
  - Body: { name, email, password }
  - Retorno: { token: "dev-token", user: { id, name, email, role: "user" } }
- GET /api/auth/me
  - Retorno: { user: { id, name, email, role } }

Rotas de usuários e regras (dev)
- GET /api/users
  - Query: search (ou q), role, blocked
  - Requer Authorization
  - Admin: lista completa com filtros
  - Usuário comum: só retorna a si mesmo quando search = seu e-mail; caso contrário, retorna lista vazia
- POST /api/users
  - Requer Authorization
  - Admin: pode criar qualquer usuário
  - Usuário comum: só pode criar o próprio (email do body deve ser igual ao X-User-Email)
  - Body:
    {
      name,
      email,
      role="user",
      blocked=false,
      phone,
      // Endereço separado
      addressStreet,
      addressNumber,
      addressNeighborhood,
      addressCity,
      addressState, // UF com 2 letras
      addressComplement,
      // Compatibilidade
      address,
      cep,
      country
    }
- GET /api/users/:id
  - Requer Authorization
  - Admin: acesso a qualquer ID
  - Usuário comum: somente se X-User-Id === :id
- PUT /api/users/:id
  - Requer Authorization
  - Admin ou o próprio usuário
  - Validações:
    - email (se informado): precisa ter “@”
    - name (se informado): não vazio
    - cep (se informado): exatamente 8 dígitos
    - addressState (UF, se informado): 2 letras (auto-upper)
    - phone: dígitos sem formato
    - demais campos de endereço: strings
- DELETE /api/users/:id
  - Requer Authorization
  - Somente admin

Fluxo de cadastro e perfil
- /registrar: formulário de registro; após criar conta, aparece modal sugerindo ir para o perfil (/account)
- /account:
  - Busca o usuário no store via e-mail; se não existir, cria automaticamente (somente se e-mail do body for o mesmo do usuário logado)
  - Campos: telefone (máscara visual), CEP (máscara visual), endereço separado: logradouro, número, bairro, cidade, UF, complemento, e país (select)
  - ViaCEP com debounce (~450ms): ao digitar 8 dígitos no CEP, consulta e preenche logradouro, bairro, cidade e UF automaticamente; país é definido como Brasil (se vazio)
  - Validações:
    - Telefone: 10+ dígitos se preenchido
    - CEP: 8 dígitos se preenchido
    - UF: 2 letras se preenchido

Páginas admin
- /admin/users: CRUD com filtros, protegido por role admin
- /admin/products: CRUD com validações simples, protegido por role admin

Exemplos de uso (frontend)
- Usar apiClient (axios) é recomendado — ele envia os cabeçalhos automaticamente:
  - apiClient.get('/users')
  - apiClient.post('/users', { name, email, role: 'user' })
  - apiClient.put(`/users/${id}`, { phone, addressStreet, addressNumber, addressNeighborhood, addressCity, addressState, addressComplement, address, cep, country })
  - apiClient.delete(`/users/${id}`)

Observações de desenvolvimento
- net::ERR_ABORTED em hot-updates ou prefetch (_rsc) são mensagens comuns em Next.js com HMR/RSC e não indicam falha funcional
- Reinicie o dev server após mudanças grandes para reduzir logs

Próximos passos sugeridos
- Integração completa de endereço separado (logradouro, número, bairro, cidade, UF, complemento) em todas as telas
- Validações visuais mais robustas e feedback por campo
- Upload de avatar/foto do usuário
- Middleware real de proteção de rotas com verificação de token quando o backend estiver conectado
- Filtros avançados em /admin/users (datas, múltiplos campos)
- Lista completa de países e autocomplete

Modelo de usuário (dev)
```
{
  id,
  name,
  email,
  role, // 'admin' | 'user'
  blocked: boolean,
  phone: string,
  // Endereço
  addressStreet?: string,
  addressNumber?: string,
  addressNeighborhood?: string,
  addressCity?: string,
  addressState?: string, // UF
  addressComplement?: string,
  address?: string, // compatibilidade (string composta)
  cep?: string, // somente dígitos
  country?: string,
  createdAt,
  updatedAt,
}
```

Rotas de produtos (dev)
- GET /api/products
  - Query: category, q
  - Retorno: lista de produtos do store (mock + criados em dev)
- GET /api/products/:id
  - Retorno: produto por ID
- POST /api/products
  - Body: { name, description?, price, images?, category?, tags?, inStock?, isDigital?, fileUrl?, dimensions?, weight? }
  - Retorno: produto criado
- PUT /api/products/:id
  - Body: patch parcial com campos acima
  - Retorno: produto atualizado
- DELETE /api/products/:id
  - Retorno: { success: true }

Rotas de pedidos (dev)
- GET /api/orders
  - Retorno: todos os pedidos criados durante a sessão (store em disco)
- GET /api/orders/:id
  - Retorno: pedido por ID
- GET /api/orders/user
  - Retorno: pedidos do store (em dev não há filtro real por usuário)
- POST /api/orders
  - Body: { ...dadosDoPedido }
  - Retorna: { id: 'ord-<timestamp>', status: 'created', createdAt, updatedAt, ... }
- PATCH /api/orders/:id/status
  - Body: { status }
  - Atualiza status
- POST /api/orders/:id/cancel
  - Body: { reason }
  - Atualiza status para 'cancelled' e define cancelReason

Exemplos (axios)
```
// Produtos
const list = await apiClient.get('/products?q=logo');
const created = await apiClient.post('/products', { name: 'Logo Futurista', price: 199.9 });
const updated = await apiClient.put(`/products/${created.data.id}`, { inStock: 10 });
await apiClient.delete(`/products/${created.data.id}`);

// Pedidos
const order = await apiClient.post('/orders', { userId: 'u-2', items: [{ productId: 'p-001', qty: 1 }], total: 149.9 });
const fetched = await apiClient.get(`/orders/${order.data.id}`);
const byUser = await apiClient.get('/orders/user');
const cancelled = await apiClient.post(`/orders/${order.data.id}/cancel`, { reason: 'Cliente desistiu' });
const advanced = await apiClient.patch(`/orders/${order.data.id}/status`, { status: 'shipped' });
```

Créditos e licença
- Projeto interno Nerd 3D BR (uso comercial). Licenciamento a combinar conforme necessidade.

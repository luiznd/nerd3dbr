# Nerd3D BR - Instruções Docker

## Requisitos
- Docker
- Docker Compose

## Comandos Principais

### Iniciar ambiente completo
```bash
docker-compose up
```

### Iniciar ambiente em background
```bash
docker-compose up -d
```

### Iniciar apenas o ambiente simplificado (MongoDB + Frontend)
```bash
docker-compose -f docker-compose.simple.yml up
```

### Parar todos os containers
```bash
docker-compose down
```

### Reconstruir imagens
```bash
docker-compose build
```

### Visualizar logs
```bash
docker-compose logs -f
```

## Acessando as Aplicações

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **MongoDB**: mongodb://localhost:27017
- **RabbitMQ Admin**: http://localhost:15672 (usuário: guest, senha: guest)

## Estrutura de Containers
- **frontend**: Aplicação React/Next.js
- **backend**: API Go com Gin Framework
- **mongodb**: Banco de dados principal
- **redis**: Cache e sessões
- **rabbitmq**: Sistema de mensageria

## Variáveis de Ambiente
As variáveis de ambiente estão configuradas no arquivo `docker-compose.yml` e podem ser ajustadas conforme necessário.
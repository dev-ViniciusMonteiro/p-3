# Módulo de Pacientes

Este módulo é responsável pelo gerenciamento de pacientes da clínica psicológica.

## Funcionalidades

- Cadastro completo de pacientes com dados pessoais e clínicos
- Listagem de pacientes com paginação e busca
- Visualização detalhada de paciente
- Atualização de dados cadastrais
- Desativação de pacientes (exclusão lógica)
- Visualização do histórico completo do paciente

## Endpoints da API

- `POST /api/pacientes` - Criar novo paciente
- `GET /api/pacientes` - Listar pacientes (com paginação e busca)
- `GET /api/pacientes/:id` - Obter paciente por ID
- `PUT /api/pacientes/:id` - Atualizar paciente
- `DELETE /api/pacientes/:id` - Desativar paciente (exclusão lógica)
- `GET /api/pacientes/:id/historico` - Obter histórico completo do paciente

## Configuração

1. Instale as dependências:
```
npm install
```

2. Configure o arquivo `.env` na raiz do módulo:
```
# Banco de dados
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=clinica_psicologica
DB_PORT=3306

# Servidor
PORT=3001
NODE_ENV=development

# Segurança
JWT_SECRET=sua_chave_secreta
CORS_ORIGIN=*

# Serviços
AUTH_SERVICE_URL=http://localhost:3000/api/auth
```

3. Inicie o servidor:
```
npm run dev
```

## Dependências

- Express: Framework web
- MySQL2: Cliente MySQL
- Axios: Cliente HTTP para comunicação com outros módulos
- Winston: Sistema de logs
- Dotenv: Carregamento de variáveis de ambiente
- Helmet: Segurança HTTP
- CORS: Configuração de Cross-Origin Resource Sharing

## Autenticação

Todas as rotas deste módulo requerem autenticação via token JWT.
O token deve ser enviado no header Authorization:

```
Authorization: Bearer <seu_token_jwt>
```

O módulo se comunica com o serviço de autenticação (moduloLogin) para validar os tokens.
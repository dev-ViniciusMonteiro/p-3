# Documentação da API - Módulo Paciente

Esta documentação descreve os endpoints disponíveis no Módulo Paciente.

## Base URL

```
http://localhost:3001
```

## Autenticação

Todas as rotas requerem autenticação via Bearer Token.

```
Authorization: Bearer {seu_token_jwt}
```

## Endpoints

### 1. Listar Pacientes

Retorna uma lista paginada de pacientes com opção de busca.

- **URL**: `/api/pacientes`
- **Método**: `GET`
- **Parâmetros de Query**:
  - `page` (opcional): Número da página (padrão: 1)
  - `limit` (opcional): Quantidade de registros por página (padrão: 10)
  - `search` (opcional): Termo para busca por nome ou CPF

**Exemplo de Requisição**:
```
GET /api/pacientes?page=1&limit=10&search=
```

**Resposta de Sucesso**:
```json
{
  "data": [
    {
      "id": 1,
      "nome": "João da Silva",
      "data_nascimento": "1990-01-15",
      "telefone": "(11) 98765-4321",
      "email": "joao.silva@email.com"
    }
  ],
  "pagination": {
    "total": 1,
    "totalPages": 1,
    "currentPage": 1,
    "limit": 10
  }
}
```

### 2. Criar Paciente

Cria um novo registro de paciente.

- **URL**: `/api/pacientes`
- **Método**: `POST`
- **Headers**:
  - `Content-Type: application/json`
- **Corpo da Requisição**:
  - Campos obrigatórios:
    - `nome`: Nome completo do paciente
    - `data_nascimento`: Data de nascimento (formato YYYY-MM-DD)
    - `cpf`: CPF do paciente (formato XXX.XXX.XXX-XX)
    - `telefone`: Telefone do paciente
    - `email`: Email do paciente
  - Campos opcionais:
    - `endereco`: Endereço do paciente
    - `numero`: Número do endereço
    - `complemento`: Complemento do endereço
    - `bairro`: Bairro
    - `cidade`: Cidade
    - `uf`: Estado (2 caracteres)
    - `cep`: CEP
    - `sexo_genero`: Sexo/Gênero do paciente
    - `rg`: RG do paciente
    - `responsavel`: Nome do responsável (se aplicável)
    - `telefone_responsavel`: Telefone do responsável
    - `escolaridade`: Nível de escolaridade
    - `profissao`: Profissão
    - `queixa_principal`: Queixa principal do paciente
    - `cid`: Código CID
    - `historico_desenvolvimento`: Histórico de desenvolvimento
    - `encaminhamento`: Informações de encaminhamento
    - `status_consentimento`: Status do consentimento (Pendente, Assinado, Recusado)
    - `outras_informacoes`: Outras informações relevantes

**Exemplo de Requisição**:
```json
{
  "nome": "João da Silva",
  "data_nascimento": "1990-01-15",
  "cpf": "123.456.789-00",
  "telefone": "(11) 98765-4321",
  "email": "joao.silva@email.com",
  "endereco": "Rua das Flores",
  "numero": "123",
  "complemento": "Apto 45",
  "bairro": "Centro",
  "cidade": "São Paulo",
  "uf": "SP",
  "cep": "01234-567",
  "sexo_genero": "Masculino",
  "rg": "12.345.678-9",
  "escolaridade": "Superior Completo",
  "profissao": "Engenheiro",
  "queixa_principal": "Ansiedade e dificuldade para dormir",
  "cid": "F41.1",
  "historico_desenvolvimento": "Sem intercorrências significativas",
  "encaminhamento": "Clínico Geral",
  "status_consentimento": "Pendente",
  "outras_informacoes": "Primeira vez em terapia"
}
```

**Resposta de Sucesso**:
```json
{
  "message": "Paciente cadastrado com sucesso",
  "paciente": {
    "id": 1,
    "nome": "João da Silva",
    "data_nascimento": "1990-01-15",
    "cpf": "123.456.789-00",
    "telefone": "(11) 98765-4321",
    "email": "joao.silva@email.com",
    ...
  }
}
```

### 3. Obter Paciente por ID

Retorna os dados de um paciente específico.

- **URL**: `/api/pacientes/:id`
- **Método**: `GET`
- **Parâmetros de URL**:
  - `id`: ID do paciente

**Exemplo de Requisição**:
```
GET /api/pacientes/1
```

**Resposta de Sucesso**:
```json
{
  "id": 1,
  "nome": "João da Silva",
  "data_nascimento": "1990-01-15",
  "cpf": "123.456.789-00",
  "telefone": "(11) 98765-4321",
  "email": "joao.silva@email.com",
  ...
}
```

### 4. Atualizar Paciente

Atualiza os dados de um paciente existente.

- **URL**: `/api/pacientes/:id`
- **Método**: `PUT`
- **Parâmetros de URL**:
  - `id`: ID do paciente
- **Headers**:
  - `Content-Type: application/json`
- **Corpo da Requisição**: Campos a serem atualizados

**Exemplo de Requisição**:
```json
{
  "telefone": "(11) 99999-8888",
  "email": "joao.silva.novo@email.com",
  "endereco": "Avenida Principal",
  "numero": "456",
  "complemento": "Bloco B, Apto 101",
  "queixa_principal": "Ansiedade, insônia e dificuldade de concentração"
}
```

**Resposta de Sucesso**:
```json
{
  "message": "Paciente atualizado com sucesso",
  "paciente": {
    "id": 1,
    "telefone": "(11) 99999-8888",
    "email": "joao.silva.novo@email.com",
    "endereco": "Avenida Principal",
    "numero": "456",
    "complemento": "Bloco B, Apto 101",
    "queixa_principal": "Ansiedade, insônia e dificuldade de concentração"
  }
}
```

### 5. Desativar Paciente

Realiza a exclusão lógica de um paciente.

- **URL**: `/api/pacientes/:id`
- **Método**: `DELETE`
- **Parâmetros de URL**:
  - `id`: ID do paciente

**Exemplo de Requisição**:
```
DELETE /api/pacientes/1
```

**Resposta de Sucesso**:
```json
{
  "message": "Paciente desativado com sucesso"
}
```

### 6. Obter Histórico Completo

Retorna o histórico completo de um paciente, incluindo dados cadastrais, sessões, fichas TCC e testes.

- **URL**: `/api/pacientes/:id/historico`
- **Método**: `GET`
- **Parâmetros de URL**:
  - `id`: ID do paciente

**Exemplo de Requisição**:
```
GET /api/pacientes/1/historico
```

**Resposta de Sucesso**:
```json
{
  "paciente": {
    "id": 1,
    "nome": "João da Silva",
    ...
  },
  "sessoes": [
    {
      "id": 1,
      "data_sessao": "2023-06-10T10:00:00",
      ...
    }
  ],
  "fichasTCC": [
    {
      "id": 1,
      "data": "2023-06-15",
      ...
    }
  ],
  "testes": [
    {
      "id": 1,
      "data_aplicacao": "2023-06-20",
      ...
    }
  ]
}
```

## Códigos de Status

- `200 OK`: Requisição bem-sucedida
- `201 Created`: Recurso criado com sucesso
- `400 Bad Request`: Parâmetros inválidos ou ausentes
- `401 Unauthorized`: Falha na autenticação
- `404 Not Found`: Recurso não encontrado
- `409 Conflict`: Conflito (ex: CPF já cadastrado)
- `500 Internal Server Error`: Erro interno do servidor
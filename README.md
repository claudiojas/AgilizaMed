# AgilizMed

**"Foque no paciente, nós escrevemos o prontuário."**

## Visão Geral

AgilizMed é o módulo de HealthTech do AgilizAI, projetado para reduzir drasticamente o tempo gasto com burocracia médica. Nossa solução transforma o áudio de uma consulta médica em um prontuário eletrônico estruturado, de forma automática e inteligente, utilizando o que há de mais moderno em Inteligência Artificial.

O público-alvo são médicos de consultório particular, clínicas populares e plataformas de telemedicina que buscam otimizar seu tempo e focar no que realmente importa: o atendimento ao paciente.

## Funcionalidades

- ✅ **Autenticação Segura:** Sistema de login com JWT para garantir que apenas médicos autorizados acessem os dados.
- ✅ **Gerenciamento de Usuários (CRUD):** Endpoints completos para criar, ler, atualizar e deletar usuários (médicos).
- ✅ **Gerenciamento de Pacientes:** Endpoints para criar e listar pacientes associados a um médico.
- ✅ **Fluxo de Prontuários Inteligente:**
    - **Processamento de Áudio:** Endpoint que recebe um áudio, transcreve e estrutura com IA, retornando um rascunho.
    - **Persistência de Prontuário:** Endpoint que recebe o rascunho (revisado pelo médico) e o salva permanentemente.

*(Legenda: ✅ Implementado)*

## Stack de Tecnologias

- **Monorepo:** PNPM Workspaces
- **Backend (`/apps/api`):**
  - **Runtime:** Node.js
  - **Framework:** Fastify
  - **Linguagem:** TypeScript
  - **ORM:** Prisma
  - **IA:** Google Cloud Speech-to-Text & Google Gemini
  - **Banco de Dados:** PostgreSQL (com Docker)
  - **Validação:** Zod
  - **Autenticação:** JWT (jsonwebtoken) & bcryptjs
- **Frontend (`/apps/web`):**
  - **Framework:** Vite + React
  - **Linguagem:** TypeScript
  - **Estilização:** Tailwind CSS & shadcn-ui

## Como Começar (Ambiente de Desenvolvimento)

Siga os passos abaixo para configurar e executar o projeto localmente.

### Pré-requisitos

- Node.js (v20.9.0 ou superior)
- pnpm (v10.27.0 ou superior)
- Docker e Docker Compose

### 1. Clonar o Repositório

```bash
git clone <URL_DO_REPOSITORIO_AQUI>
cd agilizmed
```

### 2. Instalar Dependências

Instale todas as dependências do monorepo a partir da raiz do projeto.

```bash
pnpm install
```

### 3. Configurar Variáveis de Ambiente (Backend)

Navegue até a pasta da API, copie o arquivo de exemplo `.env.example` para `.env` e preencha as variáveis, especialmente as credenciais da Google Cloud (`GOOGLE_API_KEY`, etc.).

```bash
cd apps/api
cp .env.example .env
```
*Observação: As variáveis de banco de dados no `.env.example` já são compatíveis com a configuração do `docker-compose.yml`.*

### 4. Iniciar o Banco de Dados

Com o Docker em execução, inicie o container do PostgreSQL.

```bash
cd apps/api # se não estiver no diretório
docker-compose up -d
```

### 5. Aplicar as Migrações do Banco

Este comando irá criar/atualizar as tabelas no banco de dados com base no schema do Prisma.

```bash
pnpm exec prisma migrate dev
```

### 6. Executar a Aplicação

Para iniciar o backend e o frontend simultaneamente, execute o seguinte comando a partir da **raiz do projeto**:

```bash
pnpm --parallel --filter "./apps/*" dev
```

- O **Backend (API)** estará disponível em `http://localhost:3333`.
- O **Frontend (Web)** estará disponível em `http://localhost:5173`.

## Endpoints da API

A base de todas as rotas é `http://localhost:3333/api`.

### Autenticação
- `POST /auth/login`: Autentica um usuário e retorna um token JWT.

### Usuários (Médicos)
- `POST /users`: Cria um novo usuário.
- `GET /users`: (Protegido) Lista todos os usuários.
- `GET /users/:id`: (Protegido) Busca um usuário pelo ID.
- `PUT /users/:id`: (Protegido) Atualiza um usuário.
- `DELETE /users/:id`: (Protegido) Deleta um usuário.

### Pacientes (Protegido)
- `POST /patients`: Cria um novo paciente associado ao médico logado.
- `GET /patients`: Lista todos os pacientes do médico logado.

### Prontuários (Protegido)
O fluxo de prontuários ocorre em duas etapas:

1.  **`POST /records/process-audio`**
    -   **Propósito:** Processa o áudio da consulta.
    -   **Body:** `form-data` com um campo `file` contendo o arquivo de áudio.
    -   **Retorna:** Um `JSON` com o "rascunho" do prontuário, sem salvar no banco.

2.  **`POST /records`**
    -   **Propósito:** Salva o prontuário permanentemente.
    -   **Body:** Um `JSON` contendo os dados do prontuário (revisados pelo médico) e o `patientId`.
    -   **Retorna:** O objeto completo do prontuário salvo.

Para acessar uma rota protegida, inclua o token no cabeçalho da requisição:
`Authorization: Bearer <seu_token_jwt>`

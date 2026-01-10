# AgilizMed

**"Foque no paciente, nós escrevemos o prontuário."**

## Visão Geral

AgilizMed é o módulo de HealthTech do AgilizAI, projetado para reduzir drasticamente o tempo gasto com burocracia médica. Nossa solução transforma o áudio de uma consulta médica em um prontuário eletrônico estruturado, de forma automática e inteligente, utilizando o que há de mais moderno em Inteligência Artificial.

O público-alvo são médicos de consultório particular, clínicas populares e plataformas de telemedicina que buscam otimizar seu tempo e focar no que realmente importa: o atendimento ao paciente.

## Funcionalidades

- ✅ **Autenticação Segura:** Sistema de login com JWT para garantir que apenas médicos autorizados acessem os dados.
- ✅ **Gerenciamento de Usuários (CRUD):** Endpoints completos para criar, ler, atualizar e deletar usuários (médicos).
- 🚧 **Upload de Áudio da Consulta:** Endpoint para receber os arquivos de áudio gravados.
- ⏳ **Transcrição Automática:** Integração com a API Whisper da OpenAI para transcrever o áudio em texto.
- ⏳ **Estruturação com IA:** Uso de um LLM (GPT-4o/Claude) para analisar o texto e extrair informações em um formato JSON estruturado (Queixa, HDA, etc.).
- ⏳ **Armazenamento de Prontuários:** Persistência dos prontuários estruturados no banco de dados.

*(Legenda: ✅ Implementado, 🚧 Em Andamento, ⏳ Próximos Passos)*

## Stack de Tecnologias

- **Monorepo:** PNPM Workspaces
- **Backend (`/apps/api`):**
  - **Runtime:** Node.js
  - **Framework:** Fastify
  - **Linguagem:** TypeScript
  - **ORM:** Prisma
  - **Banco de Dados:** PostgreSQL (com Docker)
  - **Validação:** Zod
  - **Autenticação:** JWT (jsonwebtoken) & bcryptjs
- **Frontend (`/apps/web`):**
  - **Framework:** Next.js
  - **Linguagem:** TypeScript
  - **Estilização:** Tailwind CSS

## Como Começar (Ambiente de Desenvolvimento)

Siga os passos abaixo para configurar e executar o projeto localmente.

### Pré-requisitos

- Node.js (v20.9.0 ou superior)
- pnpm (v10.27.0 ou superior)
- Docker e Docker Compose

### 1. Clonar o Repositório

```bash
git clone <URL_DO_REPOSITORIO_AQUI>
cd AgilizaMed
```

### 2. Instalar Dependências

Instale todas as dependências do monorepo a partir da raiz do projeto.

```bash
pnpm install
```

### 3. Configurar Variáveis de Ambiente (Backend)

Navegue até a pasta da API, copie o arquivo de exemplo `.env.example` e preencha as variáveis, se necessário.

```bash
cd apps/api
cp .env.example .env
```
*Observação: As variáveis padrão no `.env.example` já são compatíveis com a configuração do `docker-compose.yml`.*

### 4. Iniciar o Banco de Dados

Com o Docker em execução, inicie o container do PostgreSQL.

```bash
docker-compose up -d
```

### 5. Aplicar as Migrações do Banco

Este comando irá criar as tabelas `User` e `Record` no banco de dados.

```bash
pnpm exec prisma migrate dev
```

### 6. Executar a Aplicação

Para iniciar o backend e o frontend simultaneamente, execute o seguinte comando a partir da **raiz do projeto**:

```bash
pnpm --parallel --filter "./apps/*" dev
```

- O **Backend (API)** estará disponível em `http://localhost:3333`.
- O **Frontend (Web)** estará disponível em `http://localhost:3000`.

## Endpoints da API (Atuais)

- `POST /api/users`: Cria um novo usuário.
- `POST /api/auth/login`: Autentica um usuário e retorna um token JWT.

### Rotas Protegidas (Requerem Token JWT)

- `GET /api/users`: Lista todos os usuários.
- `GET /api/users/:id`: Busca um usuário pelo ID.
- `PUT /api/users/:id`: Atualiza um usuário.
- `DELETE /api/users/:id`: Deleta um usuário.

Para acessar uma rota protegida, inclua o token no cabeçalho da requisição:
`Authorization: Bearer <seu_token_jwt>`

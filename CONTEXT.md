# CONTEXT.md - Andamento do Projeto AgilizMed

Este documento resume o progresso técnico e as decisões de arquitetura tomadas durante o desenvolvimento do projeto AgilizMed.

## 1. Estrutura do Projeto

- **Monorepo:** O projeto foi configurado como um monorepo gerenciado pelo `pnpm workspaces`.
- **Estrutura de Diretórios:**
  - `apps/`: Contém as aplicações principais.
    - `api/`: O backend da aplicação (Node.js/Fastify).
    - `web/`: O frontend da aplicação (Next.js).
  - `packages/`: Pretendido para pacotes compartilhados.
  - `apps/api/src/mocks/`: Diretório para armazenar dados mockados para testes e placeholders.

## 2. Backend (`apps/api`)

A API foi construída seguindo um padrão de arquitetura em camadas para garantir a separação de responsabilidades, testabilidade e manutenibilidade.

### Tecnologias Principais:
- **Framework:** Fastify com TypeScript.
- **Execução em Desenvolvimento:** `tsx` para hot-reload.
- **ORM:** Prisma para interação com o banco de dados.
- **Banco de Dados:** PostgreSQL, gerenciado via Docker Compose.
- **Validação:** Zod para validação de dados de entrada.
- **Autenticação:** JWT (JSON Web Tokens) com `jsonwebtoken` e `bcryptjs` para hashing de senhas.
- **Upload de Arquivos:** `@fastify/multipart`.

### Arquitetura em Camadas:
1.  **Router (`routes/*.router.ts`):** Camada responsável por receber as requisições HTTP, delegar para os Use Cases e formatar as respostas.
2.  **Use Case (`usecase/*.usercase.ts`):** Contém a lógica de negócio principal da aplicação. Orquestra as operações, realiza validações com Zod e manipula a lógica de segurança.
3.  **Repository (`repositories/*.repositorie.ts`):** Camada de acesso a dados. É a única camada que interage diretamente com o Prisma Client.
4.  **Interfaces (`interfaces/*.interfaces.ts`):** Contratos que definem a estrutura dos dados e os métodos para cada recurso (`User`, `Record`).

### Funcionalidades Implementadas:

- **Gerenciamento de Usuários (CRUD Completo):**
  - Endpoints `POST`, `GET`, `PUT`, `DELETE` para `/api/users`.

- **Autenticação:**
  - `POST /api/auth/login`: Endpoint de login que retorna um JWT.
  - **Middleware de Autorização:** Hook que protege as rotas que necessitam de autenticação.

- **Gerenciamento de Prontuários (Estrutura Inicial):**
  - `POST /api/records/upload-audio`: Endpoint protegido para upload de arquivos de áudio.
  - **Lógica de Placeholder:** Atualmente, este endpoint salva um prontuário com dados mockados para validar o fluxo, sem ainda chamar as APIs de IA.

### Correção de Bugs:
- **Deleção de Usuário:** Corrigido um erro de violação de chave estrangeira ao deletar um usuário que possuía prontuários. A solução foi adicionar a regra `onDelete: Cascade` ao schema do Prisma e aplicar uma nova migração.

### Refatorações de Código:
- O arquivo de interface de usuário foi renomeado de `methods.interfaces.ts` para `user.interfaces.ts` para melhor consistência.
- Os dados mockados do `UploadAudioUseCase` foram movidos para um diretório `src/mocks/` para separar dados de teste da lógica de produção.

### Próximos Passos:
- Substituir a lógica de placeholder no `UploadAudioUseCase` pelas chamadas reais às APIs da OpenAI (Whisper e GPT-4o/Claude).
- Implementar o restante do CRUD para o recurso `Record`.

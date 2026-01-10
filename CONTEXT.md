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
- **Serviços de IA:** `@google/generative-ai` (Gemini) e `@google-cloud/speech` (Speech-to-Text).

### Arquitetura em Camadas:
1.  **Router (`routes/*.router.ts`):** Camada responsável por receber as requisições HTTP, delegar para os Use Cases e formatar as respostas.
2.  **Use Case (`usecase/*.usercase.ts`):** Contém a lógica de negócio principal da aplicação. Orquestra as operações, realiza validações com Zod e manipula a lógica de segurança.
3.  **Repository (`repositories/*.repositorie.ts`):** Camada de acesso a dados. É a única camada que interage diretamente com o Prisma Client.
4.  **Interfaces (`interfaces/*.interfaces.ts`):** Contratos que definem a estrutura dos dados e os métodos para cada recurso (`User`, `Record`).
5.  **Serviços Externos (`services/*.service.ts`):** Encapsula a interação com APIs externas (ex: `google.service.ts`).

### Funcionalidades Implementadas:

- **Gerenciamento de Usuários (CRUD Completo):**
  - Endpoints `POST`, `GET`, `PUT`, `DELETE` para `/api/users`.

- **Autenticação:**
  - `POST /api/auth/login`: Endpoint de login que retorna um JWT.
  - **Middleware de Autorização:** Hook que protege as rotas que necessitam de autenticação.

- **Gerenciamento de Prontuários (Funcionalidade Principal Implementada):**
  - `POST /api/records/upload-audio`: Endpoint protegido para upload de arquivos de áudio.
  - **Integração Completa com IA:** O áudio é transcrevido pela **Google Cloud Speech-to-Text** e, em seguida, estruturado em JSON pelo **Google Gemini** (conforme o System Prompt), e finalmente salvo no banco de dados.

### Correção de Bugs:
- **Deleção de Usuário:** Corrigido um erro de violação de chave estrangeira ao deletar um usuário que possuía prontuários. A solução foi adicionar a regra `onDelete: Cascade` ao schema do Prisma e aplicar uma nova migração.
- **Integração Google AI:** Resolvidos problemas de configuração de modelo e formato de áudio para Speech-to-Text, além de problemas de nomeclatura de modelo Gemini.

### Refatorações de Código:
- O arquivo de interface de usuário foi renomeado de `methods.interfaces.ts` para `user.interfaces.ts` para melhor consistência.
- Os dados mockados do `UploadAudioUseCase` foram movidos para um diretório `src/mocks/` para separar dados de teste da lógica de produção.
- `OpenAIService` e suas dependências foram removidos e substituídos por `GoogleService`.
- O schema Zod para `Record` foi ajustado para aceitar valores `null` ou `[]` como retorno da IA.

### Próximos Passos:
- Implementar o restante do CRUD para o recurso `Record` (listar, buscar por ID, atualizar e deletar prontuários).
- Integrar o frontend (`apps/web`) com o backend.
- Avaliar a necessidade de uma camada de conversão de áudio (FFmpeg) para suportar múltiplos formatos de entrada de áudio.

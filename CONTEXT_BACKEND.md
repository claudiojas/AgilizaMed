# CONTEXT.md - Andamento do Projeto AgilizMed

Este documento resume o progresso técnico e as decisões de arquitetura tomadas durante o desenvolvimento do projeto AgilizMed.

## 1. Estrutura do Projeto
*(Sem alterações nesta seção)*
- **Monorepo:** `pnpm workspaces`.
- **Estrutura de Diretórios:** `apps/api` e `apps/web`.

## 2. Backend (`apps/api`)

A API foi construída seguindo um padrão de arquitetura em camadas (Router, Use Case, Repository, Interface) para garantir a separação de responsabilidades e manutenibilidade.

### Tecnologias Principais:
- **Framework:** Fastify com TypeScript.
- **ORM:** Prisma.
- **Banco de Dados:** PostgreSQL (Docker).
- **Validação:** Zod.
- **Autenticação:** JWT.
- **IA:** OpenAI Whisper & Google Gemini.

### Arquitetura em Camadas:
*(Sem alterações nesta seção)*

### Funcionalidades Implementadas:

- **Gerenciamento de Usuários (CRUD Básico):**
  - Endpoints para criar, ler, atualizar e deletar usuários.

- **Autenticação:**
  - `POST /api/auth/login` com retorno de token JWT.
  - Middleware de autorização protegendo todas as rotas de negócio.

- **Gerenciamento de Pacientes:**
  - Adicionado modelo `Patient` ao `schema.prisma`, com relação obrigatória ao `User`.
  - `POST /api/patients`: Endpoint para criar um novo paciente associado ao médico logado.
  - `GET /api/patients`: Endpoint para listar todos os pacientes do médico logado.
  - Implementado o ciclo completo de Interface, Repositório, Use Case e Rota.

- **Fluxo de Prontuários em Duas Etapas:**
  1.  `POST /api/records/process-audio`: Endpoint que recebe um arquivo de áudio, o transcreve com **OpenAI Whisper** e o estrutura com **Google Gemini**, retornando um **rascunho JSON**.
  2.  `POST /api/records`: Endpoint que recebe o rascunho JSON (revisado pelo frontend), valida os dados com Zod (incluindo o `patientId` obrigatório) e **salva o prontuário final** no banco.

### Correção de Bugs:
- **Deleção de Usuário:** Adicionado `onDelete: Cascade` ao schema do Prisma para evitar erros de chave estrangeira.
- **Dessincronização do Prisma Client:** Resolvido um problema recorrente onde o Prisma Client gerado não correspondia ao `schema.prisma`. A solução foi forçar a regeneração com `pnpm exec prisma generate`.
- **Debugging do Fluxo de IA:**
  - **Problema (Google STT):** A API síncrona do Google limitava áudios a 1 min. A API assíncrona (`longRunningRecognize`) exigia o uso do Google Cloud Storage (GCS), considerado inviável (custo/complexidade) para a fase atual.
  - **Solução (Pivô para Whisper):** Substituímos o Google STT pelo OpenAI Whisper, que suporta áudios de até 25MB via upload direto, simplificando a arquitetura e evitando custos de armazenamento.
  - **Correção de Autenticação e Cota (Whisper):** Guiamos o usuário na correção da chave de API (`401`) e na adição de créditos para resolver o erro de cota (`429`).
  - **Correção do Modelo (Gemini):** O erro `404 Not Found` na etapa de estruturação foi resolvido utilizando o nome de modelo `gemini-pro-latest`.
  - **Correção do Upload (Fastify):** Aumentamos o limite de tamanho de arquivo do Fastify para 25MB para acomodar os áudios.

### Refatorações de Código:
- **Validação com Zod:** As rotas de criação de prontuário e paciente foram robustecidas com schemas Zod.
- **Abordagem Híbrida de IA:** O `GoogleService` foi refatorado para orquestrar a chamada a dois provedores de IA distintos (OpenAI para transcrição, Google para estruturação).

### Próximos Passos:
- **Finalizar CRUD de Pacientes:** Implementar rotas `GET /:id`, `PUT /:id` e `DELETE /:id` para o recurso `Patient`.
- **Finalizar CRUD de Prontuários:** Implementar rotas `GET`, `PUT` e `DELETE` para o recurso `Record`.
- **Documentação de API (Swagger/OpenAPI):** Gerar documentação interativa para os endpoints.
- **Testes:** Escrever testes unitários e de integração para os fluxos implementados.

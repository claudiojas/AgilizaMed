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
  - Adicionado modelo `Patient` ao `schema.prisma`.
  - `POST /api/patients`: Endpoint para criar um novo paciente.
  - `GET /api/patients`: Endpoint para listar todos os pacientes do médico.
  - `GET /api/patients/:id`: Endpoint para buscar um paciente específico.
  - Implementado o ciclo completo de Interface, Repositório, Use Case e Rota.

- **Fluxo de Prontuários e Gerenciamento:**
  - `GET /api/records`: Endpoint para listar todos os prontuários do médico (incluindo dados do paciente).
  - **Criação em Duas Etapas:**
    1.  `POST /api/records/process-audio`: Endpoint que transcreve com **OpenAI Whisper** e estrutura com **Google Gemini**, retornando um **rascunho JSON**.
    2.  `POST /api/records`: Endpoint que recebe o rascunho, valida com Zod e **salva o prontuário final**.

### Correção de Bugs:
- **Deleção de Usuário:** Adicionado `onDelete: Cascade` ao schema do Prisma.
- **Dessincronização do Prisma Client:** Resolvido problema de cliente gerado não corresponder ao `schema.prisma` com `pnpm exec prisma generate`.
- **Debugging do Fluxo de IA:**
  - **Problema (Google STT):** Limite de 1 min na API síncrona e requisito de GCS na assíncrona.
  - **Solução (Pivô para Whisper):** Substituição pelo OpenAI Whisper para suportar áudios longos via upload direto.
  - **Correção de Autenticação e Cota (Whisper):** Resolução dos erros `401` e `429`.
  - **Correção do Modelo (Gemini):** Correção do erro `404` utilizando o nome `gemini-pro-latest`.
  - **Correção do Upload (Fastify):** Aumento do limite de tamanho de arquivo para 25MB.

### Refatorações de Código:
- **Validação com Zod:** As rotas de criação foram robustecidas com schemas Zod.
- **Abordagem Híbrida de IA:** O `GoogleService` foi refatorado para usar OpenAI (transcrição) e Google (estruturação).
- **Melhora de Tipagem:** Introduzido o tipo `RecordWithPatient` no backend para garantir a segurança de tipo ao retornar prontuários com dados de pacientes incluídos.

### Próximos Passos:
- **Finalizar CRUD de Pacientes:** Implementar rotas `PUT /:id` e `DELETE /:id`.
- **Finalizar CRUD de Prontuários:** Implementar rotas `GET /:id`, `PUT /:id` e `DELETE /:id`.
- **Documentação de API (Swagger/OpenAPI):** Gerar documentação interativa.
- **Testes:** Escrever testes unitários e de integração.

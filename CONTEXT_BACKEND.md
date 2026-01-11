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
- **IA:** Google Cloud Speech-to-Text & Gemini.

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
  1.  `POST /api/records/process-audio`: Endpoint que recebe um arquivo de áudio, o envia para as APIs do Google (Speech-to-Text e Gemini) e retorna um **rascunho JSON** do prontuário, sem persistir no banco.
  2.  `POST /api/records`: Endpoint que recebe o rascunho JSON (revisado pelo frontend), valida os dados com Zod (incluindo o `patientId` obrigatório) e **salva o prontuário final** no banco, associando-o ao médico e ao paciente.

### Correção de Bugs:
- **Deleção de Usuário:** Adicionado `onDelete: Cascade` ao schema do Prisma para evitar erros de chave estrangeira.
- **Dessincronização do Prisma Client:** Resolvido um problema recorrente onde o Prisma Client gerado não correspondia ao `schema.prisma` (ex: esperava o campo `doctor` em vez de `user`). A solução foi forçar a regeneração com `pnpm exec prisma generate`.

### Refatorações de Código:
- **Validação com Zod:** As rotas de criação de prontuário e paciente foram robustecidas com schemas Zod para validar o corpo da requisição, eliminando a necessidade de `as any` e melhorando a segurança e o feedback de erros.
- **Consistência de Nomenclatura:** Adotada uma nomenclatura consistente nas camadas da arquitetura para os novos recursos.

### Próximos Passos:
- **Finalizar CRUD de Pacientes:** Implementar rotas `GET /:id`, `PUT /:id` e `DELETE /:id` para o recurso `Patient`.
- **Finalizar CRUD de Prontuários:** Implementar rotas `GET`, `PUT` e `DELETE` para o recurso `Record`.
- **Documentação de API (Swagger/OpenAPI):** Gerar documentação interativa para os endpoints.
- **Testes:** Escrever testes unitários e de integração para os fluxos implementados.

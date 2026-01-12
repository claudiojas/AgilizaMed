# CONTEXT_FRONTEND.md - Andamento do Projeto AgilizMed (Frontend)

Este documento resume o progresso técnico e as decisões de arquitetura tomadas durante o desenvolvimento do frontend do projeto AgilizMed.

## 1. Estrutura e Tecnologias

- **Framework/Build Tool:** O projeto utiliza **Vite + React** para um desenvolvimento rápido e leve, adequado para um dashboard.
- **Linguagem:** TypeScript.
- **Estilização:** Tailwind CSS.
- **Componentes UI:** A base do projeto utiliza componentes `shadcn-ui`.
- **Roteamento:** `react-router-dom` para gerenciar as rotas da SPA.
- **Cliente HTTP:** `axios` para a comunicação com a API do backend (`src/lib/api.ts`).

## 2. Funcionalidades Implementadas

### Fluxo de Autenticação
- **Gerenciamento de Estado:** `AuthContext` com `localStorage` para persistência do token JWT.
- **Páginas:** `Login.tsx` e `SignUp.tsx` funcionais.
- **Rotas Protegidas:** `ProtectedRoute` implementado para as páginas internas.

### Gerenciamento de Pacientes (`Patients.tsx`)
- Conexão completa com o backend para listar (`GET /api/patients`) e criar (`POST /api/patients`) pacientes.
- Formulário de criação em `Dialog`, com campos para nome, email, telefone e data de nascimento (com date picker).
- UI de listagem com estados de loading, erro e lista vazia.
- Botão "Iniciar Consulta" que navega para a página de consulta com o ID do paciente (`/consultation/:patientId`).

### Fluxo de Criação de Prontuário
- **Página de Consulta (`Consultation.tsx`):**
  - Recebe o `patientId` da URL.
  - Implementa a gravação de áudio com `MediaRecorder` e feedback visual.
  - Envia o áudio para o backend (`POST /api/records/process-audio`).
  - Ao receber o rascunho, navega para a página de revisão, passando os dados via estado de navegação.
- **Página de Revisão (`ReviewRecord.tsx`):**
  - Página criada para o fluxo de "rascunho e confirmação".
  - Busca e exibe o nome do paciente (`GET /api/patients/:id`) para melhor UX.
  - Apresenta os dados do rascunho em um formulário totalmente editável.
  - Permite salvar o prontuário final (`POST /api/records`) ou regravar (volta para a consulta).

### Dashboard (`Dashboard.tsx`)
- Busca e exibe a lista dos últimos prontuários do médico (`GET /api/records`).
- Exibe o nome do paciente associado a cada prontuário, enriquecendo a listagem.
- Implementa um drawer (`RecordDetailDrawer`) para visualização rápida dos detalhes do prontuário ao clicar em um card.

### Página de Prontuários (`Records.tsx`)
- Refatorada para remover dados mocados e conectar ao backend (`GET /api/records`).
- Exibe a lista completa de prontuários do usuário com busca pelo nome do paciente.
- Reutiliza o `RecordDetailDrawer` para uma experiência de usuário consistente.

### Componentes de UI
- **ConsultationCard.tsx:** Adicionada lógica defensiva para evitar quebras caso um `status` de prontuário seja inválido, exibindo um estado "Desconhecido" como fallback.

### Página de Configurações (`Settings.tsx`)
- O card de perfil tornou-se interativo e agora exibe os dados dinâmicos do usuário logado.
- Corrigido um bug de aninhamento de HTML inválido (botão dentro de botão) na renderização da lista de opções.

## 3. Limpeza e Branding
*(Sem alterações nesta seção)*

## 4. Próximos Passos Prioritários

- **Finalizar CRUD:** Implementar as funcionalidades de **edição** e **exclusão** para Pacientes e Prontuários.
- **Melhorar UX:**
    - Adicionar paginação na lista de prontuários e pacientes.
    - Implementar a funcionalidade de busca de pacientes.
- **Testes:** Escrever testes de componentes e de integração para os fluxos principais (autenticação, criação de paciente, criação de prontuário).

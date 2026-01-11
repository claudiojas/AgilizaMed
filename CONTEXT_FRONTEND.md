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
- **Gerenciamento de Estado:** `AuthContext` (`src/context/AuthContext.tsx`) gerencia o estado de autenticação (token, dados do usuário) em toda a aplicação.
- **Persistência:** O token JWT é persistido no `localStorage` do navegador.
- **Páginas de Login e Cadastro:** As páginas `Login.tsx` e `SignUp.tsx` estão conectadas aos endpoints do backend para criar usuários e fazer login.
- **Rotas Protegidas:** O componente `ProtectedRoute.tsx` garante que apenas usuários autenticados possam acessar as páginas internas do dashboard.
- **Logout:** A funcionalidade de logout foi implementada na página de `Settings.tsx`.

### Estrutura de Páginas e Navegação
- **Páginas:** A estrutura de páginas para `Dashboard`, `Records`, `Settings`, `Consultation` e `Patients` foi criada.
- **Navegação Principal:** O componente `BottomNav.tsx` foi atualizado para incluir um link para a página `/patients`, resolvendo um "beco sem saída" na navegação.

## 3. Limpeza e Branding
- O template inicial do frontend foi limpo, removendo referências a "Lovable".
- O título e metadados da aplicação foram atualizados para "AgilizMed".

## 4. Próximos Passos Prioritários

- **Refatorar Fluxo de Gravação:**
    1.  A página `Consultation.tsx` deve ser atualizada para chamar a nova rota `POST /api/records/process-audio` e receber o rascunho JSON.
    2.  Ao receber o rascunho, a aplicação deve navegar para uma nova página, **`ReviewRecord.tsx`**.
- **Criar Página de Revisão (`ReviewRecord.tsx`):**
    1. Esta nova página receberá os dados do rascunho.
    2. Exibirá os dados em um formulário editável.
    3. Terá um botão "Salvar" que fará a chamada final para `POST /api/records`, enviando o prontuário para ser salvo permanentemente.
    4. Terá um botão "Regravar", que navegará de volta para a página de `Consultation` para uma nova tentativa.
- **Conectar Listagem de Pacientes:** A página `Patients.tsx` deve ser conectada ao backend para listar e criar pacientes reais.

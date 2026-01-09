# CONTEXT_AGILIZMED.md

## 1. Visão Geral do Produto
**Nome do Projeto:** AgilizMed (Módulo HealthTech do AgilizAI)
**Objetivo:** Reduzir o tempo de burocracia médica transformando o áudio da consulta em prontuários estruturados automaticamente via IA.
**Público-Alvo:** Médicos de consultório particular, clínicas populares e telemedicina.
**Core Value:** "Foque no paciente, nós escrevemos o prontuário."

---

## 2. Arquitetura Técnica (Stack)
O projeto deve seguir a stack moderna do ecossistema JS/TS, priorizando segurança e performance.

* **Frontend:**
    * **Framework:** React (Next.js) ou Vite + React.
    * **Estilização:** Tailwind CSS (Interface limpa, "White Label" médico).
    * **State Management:** Zustand ou React Context.
    * **Áudio:** Native MediaRecorder API (para capturar áudio no navegador sem dependências pesadas).
* **Backend:**
    * **Runtime:** Node.js (Express ou NestJS) ou Serverless Functions (Next API Routes).
    * **Linguagem:** TypeScript (Strict mode).
    * **Segurança:** Criptografia de ponta a ponta (AES-256) para dados sensíveis (LGPD/HIPAA compliance).
* **Inteligência Artificial (IA):**
    * **Transcrição (STT):** OpenAI Whisper API (modelo `whisper-1`).
    * **Estruturação (LLM):** OpenAI GPT-4o ou Claude 3.5 Sonnet (via API).

---

## 3. Fluxo de Dados (Data Flow)

1.  **Captura:** O médico clica em "Gravar Consulta" no Frontend. O browser captura o áudio (chunked).
2.  **Upload:** Ao finalizar, o Frontend converte o áudio para `Blob` (.wav ou .webm) e envia para o Backend protegido.
3.  **Transcrição:** O Backend envia o arquivo de áudio para a API do **Whisper**.
    * *Input:* Áudio.
    * *Output:* Texto corrido (Raw Transcript).
4.  **Estruturação (A Mágica):** O Backend envia o texto transcrito + **System Prompt** para o LLM.
5.  **Retorno:** O LLM devolve um **JSON** estruturado.
6.  **Interface:** O Frontend recebe o JSON e popula os inputs do formulário (Queixa, Histórico, Conduta) para revisão do médico.

---

## 4. Engenharia de Prompt (System Prompt)
O prompt deve garantir que a IA atue como um "Assistente Sênior" e nunca invente dados (alucinação zero).

**Role:** Senior Medical Scribe.
**Task:** Analyze the transcription and extract structured clinical data.

**Output Format (JSON):**
```json
{
  "queixa_principal": "String (Sintoma principal relatado)",
  "hda": "String (Histórico da Doença Atual - narrativo técnico)",
  "medicamentos_uso": ["Array de Strings"],
  "alergias": ["Array de Strings" ou null],
  "exame_fisico_citado": "String (Se o médico ditou achados durante a consulta)",
  "hipotese_diagnostica": "String (Sugestão baseada no relato)",
  "conduta_sugerida": "String (Exames pedidos ou medicamentos prescritos)"
}
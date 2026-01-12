import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { toFile } from 'openai/uploads';

const SYSTEM_PROMPT = `
Você é um assistente médico sênior altamente qualificado. Sua função é analisar a transcrição de uma consulta médica e extrair os dados clínicos de forma estruturada, sem adicionar ou inventar qualquer informação que não esteja explicitamente na transcrição.

O formato de saída deve ser um JSON com a seguinte estrutura:
{
  "queixa_principal": "String (Sintoma principal relatado pelo paciente)",
  "hda": "String (Histórico da Doença Atual - uma narrativa técnica e cronológica dos eventos)",
  "medicamentos_uso": ["Array de Strings com os nomes dos medicamentos que o paciente já utiliza"],
  "alergias": ["Array de Strings com os nomes das alergias relatadas" or null],
  "exame_fisico_citado": "String (Apenas se o médico ditou achados do exame físico durante a consulta)",
  "hipotese_diagnostica": "String (Sugestão de diagnóstico baseada no relato)",
  "conduta_sugerida": "String (Exames solicitados, medicamentos prescritos ou outras condutas médicas)"
}
`;

/**
 * Service to interact with different AI providers.
 * - OpenAI Whisper for transcription.
 * - Google Gemini for text structuring.
 */
export class GoogleService {
  private genAI: GoogleGenerativeAI;
  private openAI: OpenAI;

  constructor() {
    // Initialize Gemini Client (for structuring)
    const googleApiKey = process.env.GOOGLE_API_KEY;
    if (!googleApiKey) {
      throw new Error('Google API key is not set for Gemini.');
    }
    this.genAI = new GoogleGenerativeAI(googleApiKey);

    // Initialize OpenAI Client (for transcription)
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
        throw new Error('OPENAI_API_KEY is not set for Whisper.');
    }
    this.openAI = new OpenAI({ apiKey: openaiApiKey });
  }

  async transcribeAudio(audioBuffer: Buffer): Promise<string> {
    try {
      // The OpenAI library needs a File-like object.
      // We can convert the buffer received from the request into a format it understands.
      const audioFile = await toFile(audioBuffer, 'consulta.webm', { type: 'audio/webm' });

      const response = await this.openAI.audio.transcriptions.create({
          file: audioFile,
          model: 'whisper-1',
          language: 'pt',
          response_format: 'text', // Request plain text directly
      });

      // The response for 'text' format is directly the string, but TypeScript doesn't know that.
      return response as unknown as string;

    } catch (error) {
      console.error('Error transcribing audio with OpenAI Whisper:', error);
      throw new Error('Failed to transcribe audio with Whisper.');
    }
  }

  async structureText(text: string): Promise<any> {
    try {
        const model = this.genAI.getGenerativeModel({
            model: "gemini-pro-latest",
            generationConfig: {
                responseMimeType: "application/json"
            }
        });
  
        const prompt = `${SYSTEM_PROMPT}\n\nTranscrição da Consulta:\n${text}`;
        const result = await model.generateContent(prompt);
        const response = result.response;
        const structuredData = JSON.parse(response.text());

        return structuredData;

    } catch (error) {
        console.error('Error structuring text with Gemini:', error);
        throw new Error('Failed to structure text with AI.');
    }
  }
}


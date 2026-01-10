import { GoogleGenerativeAI } from '@google/generative-ai';
import { SpeechClient } from '@google-cloud/speech';
import { IRecognizeRequest } from '@google-cloud/speech/build/src/v1';

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

export class GoogleService {
  private genAI: GoogleGenerativeAI;
  private speechClient: SpeechClient;

  constructor() {
    // Initialize Gemini Client
    const googleApiKey = process.env.GOOGLE_API_KEY;
    if (!googleApiKey) {
      throw new Error('Google API key is not set for Gemini.');
    }
    this.genAI = new GoogleGenerativeAI(googleApiKey);

    // Initialize Speech-to-Text Client
    // This client automatically uses the GOOGLE_APPLICATION_CREDENTIALS env var
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        console.warn('GOOGLE_APPLICATION_CREDENTIALS not set. Speech-to-Text will not work.');
    }
    this.speechClient = new SpeechClient();
  }

  async transcribeAudio(audioBuffer: Buffer): Promise<string> {
    const audio = {
      content: audioBuffer.toString('base64'),
    };
    const config = {
      encoding: 'FLAC',
      languageCode: 'pt-BR',
      model: 'latest_long',
      enableAutomaticPunctuation: true, // Enable automatic punctuation
    };
    const request: IRecognizeRequest = {
      audio: audio,
      config: config,
    };

    try {
      const [response] = await this.speechClient.recognize(request);
      const transcription = response.results
        ?.map(result => result.alternatives?.[0].transcript)
        .join('\n');
      
      if (!transcription) {
        throw new Error('Speech-to-Text returned no transcription.');
      }
      return transcription;
    } catch (error) {
      console.error('Error transcribing audio with Google Speech-to-Text:', error);
      throw new Error('Failed to transcribe audio.');
    }
  }

  async structureText(text: string): Promise<any> {
    try {
        const model = this.genAI.getGenerativeModel({
            model: "models/gemini-pro-latest", // Use the correct, available model
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

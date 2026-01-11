import { GoogleService } from '../services/google.service';
import { z } from 'zod';

// Zod schema to validate the structured data returned by the LLM
const recordSchemaFromAI = z.object({
    queixa_principal: z.string().nullable(),
    hda: z.string().nullable(),
    medicamentos_uso: z.array(z.string()).nullable().optional().default([]), // Allow null array and default to empty
    alergias: z.array(z.string()).nullable().optional().default([]), // Allow null array and default to empty
    exame_fisico_citado: z.string().nullable().optional(),
    hipotese_diagnostica: z.string().nullable().optional(),
    conduta_sugerida: z.string().nullable().optional(),
});


export class ProcessAudioUseCase {
  constructor(
    private googleService: GoogleService,
  ) {}

  async execute(audioBuffer: Buffer) {
    // 1. Transcribe audio using Google Cloud Speech-to-Text
    const transcript = await this.googleService.transcribeAudio(audioBuffer);

    if (!transcript) {
      throw new Error("Audio transcription returned empty.");
    }

    // 2. Structure the transcript using Gemini
    const structuredData = await this.googleService.structureText(transcript);
    
    // 3. Validate the AI-generated data
    const validatedData = recordSchemaFromAI.parse(structuredData);

    return validatedData;
  }
}

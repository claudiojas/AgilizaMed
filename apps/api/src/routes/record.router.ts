import { FastifyInstance } from "fastify";
import { z } from "zod";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ProcessAudioUseCase } from "../usecase/process-audio.usercase";
import { CreateRecordUseCase } from "../usecase/create-record.usercase";
import { ListRecordsByUserIdUseCase } from "../usecase/list-records.usercase"; // New import
import { recordRepository } from "../repositories/record.repositorie";
import { GoogleService } from "../services/google.service";

export async function recordRoutes(app: FastifyInstance) {
  // All record routes are protected
  app.addHook('onRequest', authMiddleware);

  const googleService = new GoogleService();
  const processAudioUseCase = new ProcessAudioUseCase(googleService);
  const createRecordUseCase = new CreateRecordUseCase(recordRepository);
  const listRecordsByUserIdUseCase = new ListRecordsByUserIdUseCase(recordRepository); // New use case instance

  // Route to process audio and return a structured JSON draft
  app.post('/records/process-audio', async (request, reply) => {
    try {
      const data = await request.file();
      if (!data) {
        return reply.status(400).send({ message: 'No file uploaded.' });
      }

      const fileBuffer = await data.toBuffer();
      
      const recordDraft = await processAudioUseCase.execute(fileBuffer);
      
      return reply.status(200).send(recordDraft);

    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: 'Internal Server Error' });
    }
  });

  // Define Zod schema for the request body
  const createRecordBodySchema = z.object({
    patientId: z.string().uuid("Invalid patient ID format"),
    queixa_principal: z.string(),
    hda: z.string(),
    medicamentos_uso: z.array(z.string()).optional().nullable(),
    alergias: z.array(z.string()).optional().nullable(),
    exame_fisico_citado: z.string().optional().nullable(),
    hipotese_diagnostica: z.string().optional().nullable(),
    conduta_sugerida: z.string().optional().nullable(),
  });

  // Route to create a new record from a JSON body
  app.post('/records', async (request, reply) => {
    try {
      const userId = request.user?.id;
      if (!userId) {
        return reply.status(401).send({ message: 'User not authenticated.' });
      }

      // Validate request body with Zod
      const recordData = createRecordBodySchema.parse(request.body);

      const record = await createRecordUseCase.execute(recordData, userId);
      
      return reply.status(201).send(record);

    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ message: 'Validation error.', issues: error.format() });
      }
      console.error(error);
      return reply.status(500).send({ message: 'Internal Server Error' });
    }
  });

  // Route to list all records for the authenticated user
  app.get('/records', async (request, reply) => {
      try {
          const userId = request.user?.id;
          if (!userId) {
              return reply.status(401).send({ message: 'User not authenticated.' });
          }

          const records = await listRecordsByUserIdUseCase.execute(userId);
          return reply.status(200).send(records);
      } catch (error) {
          console.error('Error listing records:', error);
          return reply.status(500).send({ message: 'Internal Server Error' });
      }
  });
}

export default recordRoutes;

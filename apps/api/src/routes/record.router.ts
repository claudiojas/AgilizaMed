import { FastifyInstance } from "fastify";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UploadAudioUseCase } from "../usecase/record.usercase";
import { recordRepository } from "../repositories/record.repositorie";
import { GoogleService } from "../services/google.service";

export async function recordRoutes(app: FastifyInstance) {
  // All record routes are protected
  app.addHook('onRequest', authMiddleware);

  const googleService = new GoogleService();
  const uploadAudioUseCase = new UploadAudioUseCase(recordRepository, googleService);

  app.post('/records/upload-audio', async (request, reply) => {
    try {
      const data = await request.file();
      if (!data) {
        return reply.status(400).send({ message: 'No file uploaded.' });
      }

      const fileBuffer = await data.toBuffer();
      const userId = request.user?.id;

      if (!userId) {
        return reply.status(401).send({ message: 'User not authenticated.' });
      }

      const record = await uploadAudioUseCase.execute(fileBuffer, userId);
      
      return reply.status(201).send(record);

    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: 'Internal Server Error' });
    }
  });
}

export default recordRoutes;

import { FastifyInstance } from "fastify";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UploadAudioUseCase } from "../usecase/record.usercase";
import { recordRepository } from "../repositories/record.repositorie";

export async function recordRoutes(app: FastifyInstance) {
  // All record routes are protected
  app.addHook('onRequest', authMiddleware);

  const uploadAudioUseCase = new UploadAudioUseCase(recordRepository);

  app.post('/records/upload-audio', async (request, reply) => {
    try {
      const data = await request.file();
      if (!data) {
        return reply.status(400).send({ message: 'No file uploaded.' });
      }

      const fileBuffer = await data.toBuffer();
      const userId = request.user?.id; // Assumed from authMiddleware

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

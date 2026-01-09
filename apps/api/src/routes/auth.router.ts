import { FastifyInstance } from "fastify";
import { AuthenticateUserUseCase } from "../usecase/auth.usercase";
import { userRepository } from "../repositories/user.repositorie";

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/login', async (request, reply) => {
    const authUserUseCase = new AuthenticateUserUseCase(userRepository);
    try {
      const result = await authUserUseCase.execute(request.body as any);
      return reply.send(result);
    } catch (error) {
      if (error instanceof Error && error.message.includes("Invalid email or password")) {
        return reply.status(401).send({ message: error.message });
      }
      return reply.status(500).send({ message: 'Internal Server Error' });
    }
  });
}

export default authRoutes;

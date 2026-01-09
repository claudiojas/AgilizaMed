import { FastifyInstance } from "fastify";
import { UserUseCase } from "../usecase/user.usercase";
import { userRepository } from "../repositories/user.repositorie";

export async function userRoutes(app: FastifyInstance) {
    const userUseCase = new UserUseCase(userRepository);

    app.get('/users', async (request, reply) => {
        try {
            const users = await userUseCase.getAllUsers();
            return reply.send(users);
        } catch (error) {
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    });

    app.get('/users/:id', async (request, reply) => {
        const { id } = request.params as { id: string };
        try {
            const user = await userUseCase.getUserById(id);
            return reply.send(user);
        } catch (error) {
            if (error instanceof Error && error.message.includes("User not found")) {
                return reply.status(404).send({ message: error.message });
            }
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    });

    app.post('/users', async (request, reply) => {
        try {
            const user = await userUseCase.createUser(request.body as any);
            return reply.status(201).send(user);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("User with this email already exists")) {
                    return reply.status(409).send({ message: error.message });
                }
            }
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    });

    app.put('/users/:id', async (request, reply) => {
        const { id } = request.params as { id: string };
        const updateData = request.body;
        // Logic to update a user by ID
        return reply.send({ message: `Update user with ID: ${id}`, data: updateData });
    });

    app.delete('/users/:id', async (request, reply) => {
        const { id } = request.params as { id: string };
        try {
            await userUseCase.deleteUser(id);
            return reply.status(204).send();
        } catch (error) {
            if (error instanceof Error && error.message.includes("User not found")) {
                return reply.status(404).send({ message: 'Internal Server Error' });
            }
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    });
};

export default userRoutes;
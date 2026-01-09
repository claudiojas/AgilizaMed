import { FastifyInstance} from "fastify";


export async function userRoutes(app: FastifyInstance) {
    app.get('/users', async (request, reply) => {
        // Logic to get all users
        return reply.send({ message: 'Get all users' });
    });

    app.get('/users/:id', async (request, reply) => {
        const { id } = request.params as { id: string };
        // Logic to get a user by ID
        return reply.send({ message: `Get user with ID: ${id}` });
    });

    app.post('/users', async (request, reply) => {
        const userData = request.body;
        // Logic to create a new user
        return reply.send({ message: 'Create a new user', data: userData });
    });

    app.put('/users/:id', async (request, reply) => {
        const { id } = request.params as { id: string };
        const updateData = request.body;
        // Logic to update a user by ID
        return reply.send({ message: `Update user with ID: ${id}`, data: updateData });
    });

    app.delete('/users/:id', async (request, reply) => {
        const { id } = request.params as { id: string };
        // Logic to delete a user by ID
        return reply.send({ message: `Delete user with ID: ${id}` });
    });
};

export default userRoutes;
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { authMiddleware } from "../middlewares/auth.middleware";
import { patientRepository } from "../repositories/patient.repositorie";
import { CreatePatientUseCase, ListPatientsUseCase, GetPatientByIdUseCase } from "../usecase/patient.usercase";

export async function patientRoutes(app: FastifyInstance) {
    // All patient routes are protected
    app.addHook('onRequest', authMiddleware);

    const createPatientUseCase = new CreatePatientUseCase(patientRepository);
    const listPatientsUseCase = new ListPatientsUseCase(patientRepository);
    const getPatientByIdUseCase = new GetPatientByIdUseCase(patientRepository); // Instantiate new use case

    // Zod schema for validating the request body when creating a patient
    const createPatientBodySchema = z.object({
        name: z.string({ required_error: "Name is required." }),
        email: z.string().email("Invalid email format.").optional().nullable(),
        phone: z.string().min(10, "Phone number is too short.").optional().nullable(),
        birthDate: z.string().datetime({ message: "Invalid date format. Use ISO 8601." }).optional().nullable(),
    });

    // Route to create a new patient
    app.post('/patients', async (request, reply) => {
        try {
            const userId = request.user?.id;
            if (!userId) {
                return reply.status(401).send({ message: 'User not authenticated.' });
            }

            const patientData = createPatientBodySchema.parse(request.body);
            const patient = await createPatientUseCase.execute(patientData, userId);
            
            return reply.status(201).send(patient);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({ message: 'Validation error.', issues: error.format() });
            }
            console.error('Error creating patient:', error);
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    });

    // Route to list all patients for the authenticated user
    app.get('/patients', async (request, reply) => {
        try {
            const userId = request.user?.id;
            if (!userId) {
                return reply.status(401).send({ message: 'User not authenticated.' });
            }

            const patients = await listPatientsUseCase.execute(userId);
            return reply.status(200).send(patients);
        } catch (error) {
            console.error('Error listing patients:', error);
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    });

    // Route to get a patient by ID
    app.get('/patients/:id', async (request, reply) => {
        try {
            const userId = request.user?.id;
            if (!userId) {
                return reply.status(401).send({ message: 'User not authenticated.' });
            }

            const { id } = request.params as { id: string };

            const patient = await getPatientByIdUseCase.execute(id, userId);

            if (!patient) {
                return reply.status(404).send({ message: 'Patient not found or not accessible.' });
            }

            return reply.status(200).send(patient);
        } catch (error) {
            console.error('Error getting patient by ID:', error);
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    });
}

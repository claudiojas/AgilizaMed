import fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import userRoutes from "./routes/user.router";
import authRoutes from "./routes/auth.router"; 
import recordRoutes from "./routes/record.router";
import { patientRoutes } from "./routes/patient.router";

export class App {
    private app: FastifyInstance;
    PORT: number;
    constructor() {
        this.app = fastify()
        this.PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
    }

    getServer(): FastifyInstance {
        return this.app;
    }

    listen() {
        this.app.listen({
            host: '0.0.0.0',
            port: this.PORT,
        }).then(() => {
            console.log(`HTTP Server running in port ${this.PORT}`);
        });
    };

    register() {
        this.app.register(cors, {
            origin: "*",
            methods: ['POST', 'DELETE', 'GET', 'PUT', 'PATCH']
        });

        // Register Multipart plugin
        this.app.register(multipart);

        // Register User Routes
        this.app.register(userRoutes, { prefix: '/api' });
        // Register Auth Routes
        this.app.register(authRoutes, { prefix: '/api' });
        // Register Record Routes
        this.app.register(recordRoutes, { prefix: '/api' });
        // Register Patient Routes
        this.app.register(patientRoutes, { prefix: '/api' });
    }
}
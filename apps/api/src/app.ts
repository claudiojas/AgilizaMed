import fastify, { FastifyInstance } from "fastify";
import { fastifyCors } from "@fastify/cors";



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
        this.app.register(fastifyCors, {
            origin: "*",
            methods: ['POST', 'DELETE', 'GET', 'PUT', 'PATCH']
        });
    }
}
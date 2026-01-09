import { FastifyRequest, FastifyReply } from 'fastify';
import { verify } from 'jsonwebtoken';

interface ITokenPayload {
  sub: string;
  iat: number;
  exp: number;
}

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return reply.status(401).send({ message: 'Authorization token not provided.' });
  }

  const [, token] = authHeader.split(' ');

  if (!token) {
    return reply.status(401).send({ message: 'Malformed token.' });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET as string);
    const { sub } = decoded as ITokenPayload;

    // Attach userId to the request object for later use
    request.user = { id: sub };

  } catch (err) {
    return reply.status(401).send({ message: 'Invalid token.' });
  }
}

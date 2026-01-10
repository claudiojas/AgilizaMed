import { IUserMethods, IUserCreate, IUserUpdate } from "../interfaces/user.interfaces";
import { prisma } from "../lib/prisma";
import type { User } from "../generated/prisma/client";

export class UserRepository implements IUserMethods {
    async createUser(data: IUserCreate): Promise<User> {
        return prisma.user.create({ data });
    }

    async updateUser(id: string, data: IUserUpdate): Promise<User> {
        return prisma.user.update({
            where: { id },
            data,
        });
    }

    async deleteUser(id: string): Promise<User> {
        return prisma.user.delete({ where: { id } });
    }

    async getUserById(id: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { id } });
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { email } });
    }

    async getAllUsers(): Promise<User[]> {
        return prisma.user.findMany();
    }
}

export const userRepository = new UserRepository();

import type { User } from "../generated/prisma/client";

export interface IUserCreate {
    email: string;
    name: string;
    password: string;
};

export interface IUserUpdate {
    email?: string;
    name?: string;
    password?: string;
};

export interface IUserMethods {

    createUser(data: IUserCreate): Promise<User>;

    updateUser(id: string, data: IUserUpdate): Promise<User>;

    deleteUser(id: string): Promise<User>;

    getUserById(id: string): Promise<User | null>;

    getUserByEmail(email: string): Promise<User | null>;

    getAllUsers(): Promise<User[]>;

}

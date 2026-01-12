import type { Patient } from "../generated/prisma/client";

export interface IPatientCreate {
    name: string;
    email?: string | null;
    phone?: string | null;
    birthDate?: Date | string | null;
    userId: string;
}

export interface IPatientUpdate {
    name?: string;
    email?: string | null;
    phone?: string | null;
    birthDate?: Date | string | null;
}

export interface IPatientMethods {
    createPatient(data: IPatientCreate): Promise<Patient>;
    getAllPatientsByUserId(userId: string): Promise<Patient[]>;
    getPatientById(id: string): Promise<Patient | null>;
    // Futuramente: updatePatient, deletePatient
}

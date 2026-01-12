import { IPatientMethods, IPatientCreate } from "../interfaces/patient.interfaces";
import { prisma } from "../lib/prisma";
import { Patient } from "@prisma/client";

export class PatientRepository implements IPatientMethods {
    async createPatient(data: IPatientCreate): Promise<Patient> {
        const { userId, birthDate, ...restOfData } = data;

        const patientData: any = {
            ...restOfData,
            user: {
                connect: {
                    id: userId,
                },
            },
        };

        if (birthDate) {
            // Ensure birthDate is a valid Date object for Prisma
            patientData.birthDate = new Date(birthDate);
        }

        return prisma.patient.create({
            data: patientData,
        });
    }

    async getAllPatientsByUserId(userId: string): Promise<Patient[]> {
        return prisma.patient.findMany({
            where: { userId },
            orderBy: {
                name: 'asc' // List patients in alphabetical order
            }
        });
    }

    async getPatientById(id: string): Promise<Patient | null> {
        return prisma.patient.findUnique({
            where: { id },
        });
    }
}

export const patientRepository = new PatientRepository();

import { IRecordMethods, IRecordCreate, IRecordUpdate } from "../interfaces/record.interfaces";
import { prisma } from "../lib/prisma";
import { Record } from "@prisma/client";

export class RecordRepository implements IRecordMethods {
    async createRecord(data: IRecordCreate): Promise<Record> {
        const { userId, ...restOfData } = data;
        return prisma.record.create({
            data: {
                ...restOfData,
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });
    }

    async updateRecord(id: string, data: IRecordUpdate): Promise<Record> {
        return prisma.record.update({
            where: { id },
            data,
        });
    }

    async deleteRecord(id: string): Promise<Record> {
        return prisma.record.delete({ where: { id } });
    }

    async getRecordById(id: string): Promise<Record | null> {
        return prisma.record.findUnique({ where: { id } });
    }

    async getAllRecordsByUserId(userId: string): Promise<Record[]> {
        return prisma.record.findMany({
            where: { userId },
        });
    }

    async getAllRecords(): Promise<Record[]> {
        return prisma.record.findMany();
    }
}

export const recordRepository = new RecordRepository();
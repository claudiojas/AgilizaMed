import type { Record, Patient } from "../generated/prisma/client";

export type RecordWithPatient = Record & {
    patient: Patient;
};

export interface IRecordCreate {
    queixa_principal: string;
    hda: string;
    medicamentos_uso?: string[];
    alergias?: string[];
    exame_fisico_citado?: string;
    hipotese_diagnostica?: string;
    conduta_sugerida?: string;
    userId: string; // The ID of the user (doctor) who created the record
    patientId: string; // The ID of the patient to whom the record belongs
}

export interface IRecordUpdate {
    queixa_principal?: string;
    hda?: string;
    medicamentos_uso?: string[];
    alergias?: string[];
    exame_fisico_citado?: string;
    hipotese_diagnostica?: string;
    conduta_sugerida?: string;
}

export interface IRecordMethods {
    createRecord(data: IRecordCreate): Promise<Record>;
    updateRecord(id: string, data: IRecordUpdate): Promise<Record>;
    deleteRecord(id: string): Promise<Record>;
    getRecordById(id: string): Promise<Record | null>;
    getAllRecordsByUserId(userId: string): Promise<RecordWithPatient[]>; // Updated return type
    getAllRecords(): Promise<Record[]>; // Maybe for admins or specific use cases
}

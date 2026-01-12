import { PatientRepository } from "../repositories/patient.repositorie";
import { IPatientCreate } from "../interfaces/patient.interfaces";

// --- Create Patient Use Case ---

// The data from the request body
type CreatePatientPayload = Omit<IPatientCreate, 'userId'>;

export class CreatePatientUseCase {
    constructor(private patientRepository: PatientRepository) {}

    async execute(payload: CreatePatientPayload, userId: string) {
        const patientToCreate: IPatientCreate = {
            ...payload,
            userId,
        };
        
        // Business logic could be added here in the future (e.g., check for duplicates)

        const patient = await this.patientRepository.createPatient(patientToCreate);
        return patient;
    }
}


// --- List Patients Use Case ---

export class ListPatientsUseCase {
    constructor(private patientRepository: PatientRepository) {}

    async execute(userId: string) {
        const patients = await this.patientRepository.getAllPatientsByUserId(userId);
        return patients;
    }
}

// --- Get Patient By ID Use Case ---
export class GetPatientByIdUseCase {
    constructor(private patientRepository: PatientRepository) {}

    async execute(patientId: string, userId: string) {
        const patient = await this.patientRepository.getPatientById(patientId);

        if (!patient || patient.userId !== userId) {
            // Ensure patient belongs to the authenticated user
            return null;
        }

        return patient;
    }
}

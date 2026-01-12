import { RecordRepository } from "../repositories/record.repositorie";

export class ListRecordsByUserIdUseCase {
    constructor(private recordRepository: RecordRepository) {}

    async execute(userId: string) {
        const records = await this.recordRepository.getAllRecordsByUserId(userId);
        return records;
    }
}

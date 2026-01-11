import { IRecordCreate } from "../interfaces/record.interfaces";
import { RecordRepository } from "../repositories/record.repositorie";

// The data received from the controller will not have the userId,
// as it's extracted from the authenticated request.
type CreateRecordData = Omit<IRecordCreate, 'userId'>;

export class CreateRecordUseCase {
  constructor(private recordRepository: RecordRepository) {}

  async execute(data: CreateRecordData, userId: string) {
    
    // Combine the record data from the request body with the user ID
    const recordToCreate: IRecordCreate = {
      ...data,
      userId,
    };

    // Use the repository to create the record in the database
    const record = await this.recordRepository.createRecord(recordToCreate);
    
    return record;
  }
}

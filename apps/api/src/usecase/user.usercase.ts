import { IUserCreate, IUserUpdate } from "../interfaces/methods.intergaces";
import { UserRepository } from "../repositories/user.repositorie";

export class UserUsercase {
    constructor(
        private userRepository: UserRepository
    ) { }

    async createUser(data: IUserCreate) {
        return this.userRepository.createUser(data);
    }

    async updateUser(id: string, data: IUserUpdate) {
        return this.userRepository.updateUser(id, data);
    }

    async deleteUser(id: string) {
        return this.userRepository.deleteUser(id);
    }

    async getUserById(id: string) {
        return this.userRepository.getUserById(id);
    }

    async getAllUsers() {
        return this.userRepository.getAllUsers();
    }

}
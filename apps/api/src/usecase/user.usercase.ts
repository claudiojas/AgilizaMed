import { hash } from 'bcryptjs';
import { z } from 'zod';
import { UserRepository } from '../repositories/user.repositorie';
import type { IUserCreate } from '../interfaces/methods.intergaces';

export class UserUseCase {
    
  constructor(private userRepository: UserRepository) {}

  async createUser(data: IUserCreate) {
    const createUserSchema = z.object({
        name: z.string().min(3, "Name must be at least 3 characters long"),
        email: z.email("Invalid email format"),
        password: z.string().min(6, "Password must be at least 6 characters long"),
    });

    const validatedData = createUserSchema.parse(data);
    const userAlreadyExists = await this.userRepository.getUserByEmail(validatedData.email);

    if (userAlreadyExists) {
      throw new Error("User with this email already exists.");
    }

    const hashedPassword = await hash(validatedData.password, 8);

    const user = await this.userRepository.createUser({
      ...validatedData,
      password: hashedPassword,
    });


    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  };

  async getAllUsers() {
    const users = await this.userRepository.getAllUsers();
    return users.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
  };

  async getUserById(id: string) {
    const getUserByIdSchema = z.uuid("Invalid user ID format");
    getUserByIdSchema.parse(id);

    const user = await this.userRepository.getUserById(id);

    if (!user) {
      throw new Error("User not found.");
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  };

  async deleteUser(id: string) {
    const getUserByIdSchema = z.uuid("Invalid user ID format");
    getUserByIdSchema.parse(id);

    const user = await this.userRepository.getUserById(id);

    if (!user) {
      throw new Error("User not found.");
    }

    await this.userRepository.deleteUser(id);
  };

}
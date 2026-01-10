import { hash } from 'bcryptjs';
import { z } from 'zod';
import { UserRepository } from '../repositories/user.repositorie';
import type { IUserCreate, IUserUpdate } from '../interfaces/user.interfaces';

// Zod schema for creation validation
const createUserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Zod schema for update validation (partial update allowed)
const updateUserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long").optional(),
  email: z.string().email("Invalid email format").optional(),
  password: z.string().min(6, "Password must be at least 6 characters long").optional(),
});

export class UserUseCase {
    
  constructor(private userRepository: UserRepository) {}

  async createUser(data: IUserCreate) {
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

  async updateUser(id: string, data: IUserUpdate) {
    const userIdSchema = z.string().uuid("Invalid user ID format");
    userIdSchema.parse(id); // Validate ID format

    const validatedData = updateUserSchema.parse(data); // Validate update data

    const existingUser = await this.userRepository.getUserById(id);
    if (!existingUser) {
      throw new Error("User not found.");
    }

    if (validatedData.email && validatedData.email !== existingUser.email) {
      const emailAlreadyTaken = await this.userRepository.getUserByEmail(validatedData.email);
      if (emailAlreadyTaken) {
        throw new Error("This email is already taken by another user.");
      }
    }

    let hashedPassword = existingUser.password;
    if (validatedData.password) {
      hashedPassword = await hash(validatedData.password, 8);
    }

    const updatedUser = await this.userRepository.updateUser(id, {
      ...validatedData,
      password: hashedPassword,
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  };

  async getAllUsers() {
    const users = await this.userRepository.getAllUsers();
    return users.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
  };

  async getUserById(id: string) {
    const getUserByIdSchema = z.string().uuid("Invalid user ID format"); // Changed z.uuid() to z.string().uuid()
    getUserByIdSchema.parse(id);

    const user = await this.userRepository.getUserById(id);

    if (!user) {
      throw new Error("User not found.");
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  };

  async deleteUser(id: string) {
    const deleteUserByIdSchema = z.string().uuid("Invalid user ID format"); // Changed z.uuid() to z.string().uuid()
    deleteUserByIdSchema.parse(id);

    const user = await this.userRepository.getUserById(id);

    if (!user) {
      throw new Error("User not found.");
    }

    await this.userRepository.deleteUser(id);
  };

}
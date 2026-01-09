import { compare } from 'bcryptjs';
import { z } from 'zod';
import { sign } from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repositorie';

const authUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string(),
});

export class AuthenticateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: z.infer<typeof authUserSchema>) {
    // 1. Validate data
    const validatedData = authUserSchema.parse(data);

    // 2. Find user by email
    const user = await this.userRepository.getUserByEmail(validatedData.email);
    if (!user) {
      throw new Error("Invalid email or password.");
    }

    // 3. Compare passwords
    const isPasswordValid = await compare(validatedData.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password.");
    }

    // 4. Generate JWT
    const token = sign(
      {
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      {
        subject: user.id,
        expiresIn: '1d', // Token expires in 1 day
      }
    );

    // 5. Return the token
    return { token };
  }
}

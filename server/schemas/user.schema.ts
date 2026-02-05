import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().min(2).max(20),
  email: z.string().email().optional(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;

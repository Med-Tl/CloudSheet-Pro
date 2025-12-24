
import { z } from 'zod';

export const AuthSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginParams = z.infer<typeof AuthSchema>;
export type RegisterParams = z.infer<typeof AuthSchema>;

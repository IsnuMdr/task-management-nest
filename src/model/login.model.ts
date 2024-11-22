import { z } from 'zod';

export class LoginUserRequest {
  username: string;
  password: string;
}

export const LoginUserRequestValidation = z.object({
  username: z.string().min(1, { message: 'Username is required' }).max(50),
  password: z.string().min(1, { message: 'Password is required' }).max(50),
});

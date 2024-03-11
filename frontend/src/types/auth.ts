import { z } from 'zod';

export const LoginPayloadSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type LoginPayload = z.infer<typeof LoginPayloadSchema>;

export const RegisterFormSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export type RegisterForm = z.infer<typeof RegisterFormSchema>;

export const RegisterPayloadSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  password_confirmation: z.string(),
});

export type RegisterPayload = z.infer<typeof RegisterPayloadSchema>;

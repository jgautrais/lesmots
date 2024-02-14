import { z } from 'zod';

export type Nullable<T> = T | null;

const ApiErrorStatusSchema = z.object({
  response: z.object({ status: z.number() }),
});

export type ApiErrorStatus = z.infer<typeof ApiErrorStatusSchema>;

export const isApiStatusErrors = (error: unknown): error is ApiErrorStatus => {
  return ApiErrorStatusSchema.safeParse(error).success;
};

import { z } from 'zod';

export type Nullable<T> = T | null;

export const KyErrorSchema = z.object({
  name: z.string(),
  response: z.object({
    json: z.function(),
  }),
});

export const isKyError = (
  error: unknown
): error is z.infer<typeof KyErrorSchema> =>
  KyErrorSchema.safeParse(error).success;

export const ApiErrorSchema = z.object({
  message: z.string(),
  errors: z.object({}),
});

export type ApiError<T> = {
  message: string;
  errors: Record<keyof T, string>;
};

export const isApiErrors = <T>(error: unknown): error is ApiError<T> => {
  return ApiErrorSchema.safeParse(error).success;
};

const ApiErrorStatusSchema = z.object({
  response: z.object({ status: z.number() }),
});

export type ApiErrorStatus = z.infer<typeof ApiErrorStatusSchema>;

export const isApiStatusErrors = (error: unknown): error is ApiErrorStatus => {
  return ApiErrorStatusSchema.safeParse(error).success;
};

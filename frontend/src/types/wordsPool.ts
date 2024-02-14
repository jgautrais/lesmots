import { z } from 'zod';

export const WordsPoolSchema = z.object({
  letters: z.array(z.string()),
  wordsPool: z.array(z.string()),
  maxLengthWords: z.string(),
});
export type WordsPool = z.infer<typeof WordsPoolSchema>;

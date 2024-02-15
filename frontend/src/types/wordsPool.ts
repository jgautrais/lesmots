import { z } from 'zod';

export const WordsPoolSchema = z.object({
  letters: z.array(z.string()),
  wordsPool: z.array(z.string()),
  maxLengthWords: z.string(),
});
export type WordsPool = z.infer<typeof WordsPoolSchema>;

export const GameDataSchema = z.object({
  foundWords: z.array(z.string()),
  wordsPool: z.array(z.string()),
});
export type GameData = z.infer<typeof GameDataSchema>;

import { instance } from '@/utils/instance';
import { GameData, WordsPool } from '@/types/wordsPool';
import { Nullable } from '@/types/common';

export const fetchOneByDate = async (date: string) =>
  instance.get(`api/wordsPool/${date}`).json<WordsPool>();

export const generateGameDataFromWordsPool = (
  pool: WordsPool | Nullable<undefined>
): GameData | Nullable<null> => {
  return pool
    ? {
        foundWords: [],
        wordsPool: pool.wordsPool,
      }
    : null;
};

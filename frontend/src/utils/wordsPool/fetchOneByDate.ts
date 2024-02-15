import { instance } from '@/utils/instance';
import { WordsPool } from '@/types/wordsPool';

export const fetchOneByDate = async (date: string) =>
  instance.get(`api/wordsPool/${date}`).json<WordsPool>();

import { PropsWithChildren, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  fetchOneByDate,
  generateGameDataFromWordsPool,
} from '@/utils/wordsPools';
import {
  FoundWordsNumber,
  LoadingSpinner,
  NineLettersFoundWords,
  WordsLengthStat,
} from '@/components/atoms';
import { SortedWordsPool } from '@/types/wordsPool';

type Props = PropsWithChildren<{
  day: string;
}>;

const baseSortedWords = {
  9: [],
  8: [],
  7: [],
  6: [],
  5: [],
  4: [],
};

const sortWordsByLength = (pool: string[]) => {
  return pool.reduce(
    (sortedWords: SortedWordsPool, word: string) => {
      const index = `${word.length}`;
      sortedWords[index].push(word.toUpperCase());
      return sortedWords;
    },
    JSON.parse(JSON.stringify(baseSortedWords))
  );
};

function WordsStats({ day }: Props) {
  const { data: wordsPool } = useQuery({
    queryKey: ['wordsPool', day],
    queryFn: () => fetchOneByDate(day),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const { data: gameData } = useQuery({
    queryKey: ['gameData', day, wordsPool],
    queryFn: () => generateGameDataFromWordsPool(wordsPool),
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: !!wordsPool,
  });

  const wordsPoolSortedByLength:
    | {
        [key: string]: string[];
      }
    | undefined = useMemo(() => {
    return gameData ? sortWordsByLength(gameData.wordsPool) : undefined;
  }, [gameData]);

  const foundWordsSortedByLength:
    | {
        [key: string]: string[];
      }
    | undefined = useMemo(() => {
    return gameData ? sortWordsByLength(gameData.foundWords) : undefined;
  }, [gameData]);

  const nineLettersFoundWords = useMemo(() => {
    return gameData?.foundWords.length
      ? gameData.foundWords.filter((foundWord) => foundWord.length === 9)[0]
      : undefined;
  }, [gameData]);

  return wordsPool && gameData ? (
    <>
      <FoundWordsNumber gameData={gameData} />
      <NineLettersFoundWords nineLettersFoundWords={nineLettersFoundWords} />
      <div className="mx-auto max-w-64 mt-6">
        {foundWordsSortedByLength && wordsPoolSortedByLength
          ? Object.entries(foundWordsSortedByLength).map((entry) => (
              <WordsLengthStat
                key={entry[0]}
                wordLengthEntry={entry}
                wordsPoolSortedByLength={wordsPoolSortedByLength}
              />
            ))
          : ''}
      </div>
    </>
  ) : (
    <LoadingSpinner className="fill-teal-400" />
  );
}

export default WordsStats;

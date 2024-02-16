import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { fetchOneByDate } from '@/utils/wordsPool/fetchOneByDate';
import { WordsPool, GameData } from '@/types/wordsPool';
import { Nullable } from '@/types/common';
import { NavBar, LettersGrid } from '@/components/molecules';
import { useMemo } from 'react';
import { LoadingSpinner } from '@/components/atoms';

const generateGameDataFromWordsPool = (
  pool: WordsPool | Nullable<undefined>
): GameData | Nullable<null> => {
  return pool
    ? {
        foundWords: [],
        wordsPool: pool.wordsPool,
      }
    : null;
};

function App() {
  const queryClient = useQueryClient();
  const day = new Date().toJSON().slice(0, 10);

  const { data: wordsPool } = useQuery({
    queryKey: ['wordsPoolOfDay', day],
    queryFn: () => fetchOneByDate(day),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const { data: gameData } = useQuery({
    queryKey: ['gameDataOfDay', day, wordsPool],
    queryFn: () => generateGameDataFromWordsPool(wordsPool),
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: !!wordsPool,
  });

  const { mutate: addFoundWord } = useMutation({
    mutationFn: async () => null,
    // When mutate is called:
    onMutate: async (word: string) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['gameDataOfDay', day, wordsPool],
      });

      // Snapshot the previous value
      const previousGameData = queryClient.getQueryData([
        'gameDataOfDay',
        day,
        wordsPool,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        ['gameDataOfDay', day, wordsPool],
        (old: GameData) => ({
          ...old,
          foundWords: [...old.foundWords, word],
        })
      );

      // Return a context object with the snapshotted value
      return { previousGameData };
    },
  });

  const nineLettersFoundWords = useMemo(() => {
    return gameData
      ? gameData.foundWords
          .filter((foundWord) => foundWord.length === 9)
          .join(', ')
      : undefined;
  }, [gameData]);

  return (
    <div className="container mx-auto">
      <NavBar />
      {wordsPool && gameData ? (
        <>
          <p className="text-center">
            <span className="font-bold text-teal-500 dark:text-teal-300">
              {gameData.foundWords.length}
            </span>{' '}
            mot
            {gameData.foundWords.length > 1 ? 's' : ''} trouvé
            {gameData.foundWords.length > 1 ? 's ' : ' '}
            sur <span className="font-bold">{gameData.wordsPool.length}</span>
          </p>
          <p className="text-center mt-2">
            <span
              className={`${nineLettersFoundWords?.toUpperCase() ? 'font-bold italic' : 'tracking-widest text-gray-600'}`}
            >
              {nineLettersFoundWords?.toUpperCase()
                ? nineLettersFoundWords?.toUpperCase()
                : '_________'}
            </span>
          </p>
          <LettersGrid
            wordsPool={wordsPool}
            gameData={gameData}
            onWordFound={(word: string) => addFoundWord(word)}
          />
        </>
      ) : (
        <LoadingSpinner className="fill-teal-400" />
      )}
    </div>
  );
}

export default App;

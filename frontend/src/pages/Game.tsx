import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { fetchOneByDate } from '@/utils/wordsPool/fetchOneByDate';
import { WordsPool, GameData } from '@/types/wordsPool';
import { Nullable } from '@/types/common';
import { NavBar, LettersGrid } from '@/components/molecules';
import { useMemo } from 'react';

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
    <div className="h-screen bg-gray-50 dark:bg-gray-700 bg-opacity-10 dark:text-gray-50">
      <div className="container mx-auto">
        <NavBar />
        {wordsPool && gameData ? (
          <>
            <p className="text-center">
              <span className="font-bold">{gameData.foundWords.length}</span>{' '}
              mot
              {gameData.foundWords.length > 1 ? 's' : ''} trouvé
              {gameData.foundWords.length > 1 ? 's ' : ' '}
              sur <span className="font-bold">{gameData.wordsPool.length}</span>
            </p>
            {nineLettersFoundWords ? (
              <p className="text-center">
                &quot;
                <span className="font-bold">
                  {nineLettersFoundWords.toUpperCase()}
                </span>
                &quot;
              </p>
            ) : (
              ''
            )}
            <LettersGrid
              wordsPool={wordsPool}
              gameData={gameData}
              onWordFound={(word: string) => addFoundWord(word)}
            />
          </>
        ) : (
          <div className="text-center">
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
      </div>
      <br />
    </div>
  );
}

export default App;

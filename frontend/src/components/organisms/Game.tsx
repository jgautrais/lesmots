import { PropsWithChildren } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { GameData } from '@/types/wordsPool';
import { LettersGrid } from '@/components/molecules';
import { FoundWordsNumber, LoadingSpinner } from '@/components/atoms';
import {
  fetchOneByDate,
  generateGameDataFromWordsPool,
} from '@/utils/wordsPools';

type Props = PropsWithChildren<{
  day: string;
}>;

function Game({ day }: Props) {
  const queryClient = useQueryClient();

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

  const { mutate: addFoundWord } = useMutation({
    mutationFn: async () => null,
    // When mutate is called:
    onMutate: async (word: string) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['gameData', day, wordsPool],
      });

      // Snapshot the previous value
      const previousGameData = queryClient.getQueryData([
        'gameData',
        day,
        wordsPool,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        ['gameData', day, wordsPool],
        (old: GameData) => ({
          ...old,
          foundWords: [...old.foundWords, word],
        })
      );

      // Return a context object with the snapshotted value
      return { previousGameData };
    },
  });

  return wordsPool && gameData ? (
    <>
      <FoundWordsNumber gameData={gameData} />
      <LettersGrid
        wordsPool={wordsPool}
        gameData={gameData}
        onWordFound={(word: string) => addFoundWord(word)}
      />
    </>
  ) : (
    <LoadingSpinner className="fill-teal-400" />
  );
}

export default Game;

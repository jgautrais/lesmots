import type { PropsWithChildren } from 'react';
import { GameData } from '@/types/wordsPool';

type Props = PropsWithChildren<{
  gameData: GameData;
}>;

function FoundWordsNumber({ gameData }: Props) {
  return (
    <p className="text-center">
      <span className="font-bold text-teal-500 dark:text-teal-300">
        {gameData.foundWords.length}
      </span>{' '}
      mot
      {gameData.foundWords.length > 1 ? 's' : ''} trouvé
      {gameData.foundWords.length > 1 ? 's ' : ' '}
      sur <span className="font-bold">{gameData.wordsPool.length}</span>
    </p>
  );
}

export default FoundWordsNumber;

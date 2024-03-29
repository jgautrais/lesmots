import { useState } from 'react';
import type { PropsWithChildren } from 'react';
import { WordsPool, GameData } from '@/types/wordsPool';
import { DeleteIcon, EraseIcon } from '@/components/atoms';

type Props = PropsWithChildren<{
  wordsPool: WordsPool;
  gameData: GameData;
  onWordFound: (word: string) => void;
}>;

const shuffle = (array: string[]) => {
  return array
    .map((a) => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);
};

const slideInDurations = [
  'animate-slideIn20',
  'animate-slideIn25',
  'animate-slideIn35',
  'animate-slideIn45',
];

function LettersGrid({ wordsPool, gameData, onWordFound }: Props) {
  const [word, setWord] = useState('');
  const [shuffledLetters] = useState(shuffle(wordsPool.letters));
  const [selectedLettersIndexes, setSelectedLettersIndexes] = useState<
    number[]
  >([]);

  const addLetter = (letter: string, index: number) => {
    setWord(word + letter);
    setSelectedLettersIndexes([...selectedLettersIndexes, index]);
  };

  const removeLastLetter = () => {
    setWord(word.slice(0, -1));
    setSelectedLettersIndexes(selectedLettersIndexes.slice(0, -1));
  };

  const resetWord = () => {
    setWord('');
    setSelectedLettersIndexes([]);
  };

  const foundWordButtonStyle = () => {
    if (word.length < 4) {
      return 'bg-transparent';
    }
    if (gameData.foundWords.includes(word)) {
      return 'bg-transparent';
    }
    if (gameData.wordsPool.includes(word)) {
      return 'border-teal-200 dark:border-teal-500 bg-teal-50 dark:bg-teal-900';
    }
    return 'bg-transparent';
  };

  const foundWordStyle = () => {
    if (word.length < 4) {
      return 'text-gray-300 dark:text-gray-500';
    }
    if (gameData.foundWords.includes(word)) {
      return 'text-teal-400 dark:text-teal-300';
    }
    if (gameData.wordsPool.includes(word)) {
      return 'text-gray-800 dark:text-gray-100 scale-125';
    }
    return 'text-gray-300 dark:text-gray-500';
  };

  return (
    <div className="mx-auto max-w-64 mt-8">
      <button
        className={`transition-all ease-out block mx-auto min-h-16 align-middle text-2xl mb-4 font-bold tracking-widest min-w-full rounded border-2 border-gray-50 dark:border-gray-600 ${foundWordButtonStyle()}`}
        disabled={!gameData.wordsPool.includes(word)}
        onClick={() => {
          if (
            gameData.wordsPool.includes(word) &&
            !gameData.foundWords.includes(word)
          ) {
            return onWordFound(word);
          }
          return null;
        }}
      >
        <p className={`transition-all ease-out ${foundWordStyle()}`}>
          &nbsp;{word.toUpperCase()}&nbsp;
        </p>
      </button>
      <div className="grid grid-cols-3 gap-4">
        {shuffledLetters.map((letter, index) => (
          <button
            key={`${letter}-${index * 2}`}
            className={`${slideInDurations[index % 4]} transition-all ease-in border rounded border-gray-200 disabled:border-gray-100 dark:border-gray-500 disabled:dark:border-gray-600 text-center min-h-16 my-1 text-4xl font-bold ${selectedLettersIndexes.includes(index) ? 'text-gray-300 dark:text-gray-500' : 'text-gray-700 dark:text-gray-100'}`}
            onClick={() => addLetter(letter, index)}
            disabled={selectedLettersIndexes.includes(index)}
          >
            {letter.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="flex mt-5">
        <button
          className="block mx-auto min-h-16 min-w-24 py-1 align-middle bg-gray-50 dark:bg-gray-600 rounded"
          onClick={() => removeLastLetter()}
          aria-label="Effacer la dernière lettre"
          disabled={!word.length}
        >
          <DeleteIcon
            className={`mx-auto w-8 h-8 ${word.length ? 'text-gray-800 dark:text-gray-200' : 'text-gray-300 dark:text-gray-500'}`}
          />
        </button>
        <button
          className="block mx-auto min-h-16 min-w-24 py-1 align-middle bg-gray-50 dark:bg-gray-600 rounded"
          onClick={() => resetWord()}
          aria-label="Effacer le mot"
          disabled={!word.length}
        >
          <EraseIcon
            className={`mx-auto w-9 h-9 ${word.length ? 'text-gray-800 dark:text-gray-200' : 'text-gray-300 dark:text-gray-500'}`}
          />
        </button>
      </div>
    </div>
  );
}

export default LettersGrid;

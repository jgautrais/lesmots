import { useState } from 'react';
import type { PropsWithChildren } from 'react';
import { WordsPool, GameData } from '@/types/wordsPool';

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

  const wordColor = () => {
    if (word.length < 4) {
      return 'text-gray-300';
    }
    if (gameData.foundWords.includes(word)) {
      return 'text-orange-200';
    }
    if (gameData.wordsPool.includes(word)) {
      return 'text-gray-800';
    }
    return 'text-gray-300';
  };

  return (
    <div className="mx-auto max-w-64 mt-10">
      <button
        className={`block mx-auto min-h-10 text-3xl mb-4 tracking-widest ${wordColor()}`}
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
        {word.toUpperCase()}
      </button>
      <div className="grid grid-cols-3 gap-2">
        {shuffledLetters.map((letter, index) => (
          <button
            key={`${letter}-${index * 2}`}
            className={`text-center py-4 text-3xl font-bold ${selectedLettersIndexes.includes(index) ? 'text-gray-300' : 'text-gray-900'}`}
            onClick={() => addLetter(letter, index)}
            disabled={selectedLettersIndexes.includes(index)}
          >
            {letter.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="flex my-10">
        <button className="block mx-auto" onClick={() => removeLastLetter()}>
          Effacer
        </button>
        <button className="block mx-auto" onClick={() => resetWord()}>
          Effacer tout
        </button>
      </div>
    </div>
  );
}

export default LettersGrid;

import React, { PropsWithChildren } from 'react';
import { SortedWordsPool } from '@/types/wordsPool';

type Props = PropsWithChildren<{
  wordLengthEntry: [string, string[]];
  wordsPoolSortedByLength: SortedWordsPool;
}>;

const slideInDurations = [
  'animate-slideIn20',
  'animate-slideIn25',
  'animate-slideIn35',
  'animate-slideIn45',
];

function WordsLengthStat({ wordLengthEntry, wordsPoolSortedByLength }: Props) {
  const [length, words] = wordLengthEntry;
  return (
    <div className="mb-4 border-t pt-1 dark:border-gray-500">
      <div
        className={`${slideInDurations[+length % 4]} flex content-center transition-all ease-out`}
      >
        <p className="shrink-0 font-bold">{length} lettres</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-800 self-center ms-2">
          <div
            className="bg-teal-500 h-2.5 rounded-full dark:bg-teal-300"
            style={{
              width: `${(words.length / wordsPoolSortedByLength[length].length) * 100}%`,
            }}
          />
        </div>
        <p className="shrink-0 font-bold text-xs self-center min-w-10 ms-2 text-end">
          {words.length} /{' '}
          <span className="min-w-5 inline-block text-start">
            {wordsPoolSortedByLength[length].length}
          </span>
        </p>
      </div>
      <p className="text-xs mt-1 ms-1 text-left">
        {words
          .sort((a, b) => a.localeCompare(b))
          .map((word, index) => (
            <React.Fragment key={word}>
              <span
                key={word}
                className={`${slideInDurations[+index % 4]} transition-all ease-out inline-block`}
              >
                {word}
              </span>
              {index !== words.length - 1 ? ' ' : ''}
            </React.Fragment>
          ))}
      </p>
    </div>
  );
}

export default WordsLengthStat;

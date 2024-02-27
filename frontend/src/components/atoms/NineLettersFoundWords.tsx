import type { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  nineLettersFoundWords: string | undefined;
}>;

const slideInDurations = [
  'animate-slideIn20',
  'animate-slideIn25',
  'animate-slideIn35',
  'animate-slideIn45',
];

function NineLettersFoundWords({ nineLettersFoundWords }: Props) {
  const word = nineLettersFoundWords
    ? nineLettersFoundWords.toUpperCase()
    : '_________';
  return (
    <p className="text-center mt-9">
      <span
        className={`tracking-widest font-bold text-2xl ${nineLettersFoundWords?.toUpperCase() ? 'text-teal-400 dark:text-teal-300' : 'text-gray-300 dark:text-gray-500'}`}
      >
        {word.split('').map((letter: string, index: number) => (
          <span
            key={`${letter}-${index * 2}`}
            className={`${slideInDurations[index % 4]} transition-all ease-out inline-block px-1`}
          >
            {letter}
          </span>
        ))}
      </span>
    </p>
  );
}

export default NineLettersFoundWords;

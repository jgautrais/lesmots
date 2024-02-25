import type { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  nineLettersFoundWords: string | undefined;
}>;

function NineLettersFoundWords({ nineLettersFoundWords }: Props) {
  return (
    <p className="text-center mt-2">
      <span
        className={`${nineLettersFoundWords?.toUpperCase() ? 'transition-all ease-out font-bold italic' : 'tracking-widest text-gray-600'}`}
      >
        {nineLettersFoundWords?.toUpperCase()
          ? nineLettersFoundWords?.toUpperCase()
          : '_________'}
      </span>
    </p>
  );
}

export default NineLettersFoundWords;

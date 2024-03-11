import WordsStats from '@/components/organisms/WordsStats';
import { NavLink } from 'react-router-dom';
import { getCurrentDateFormatted } from '@/utils/date';
import BaseTemplate from '@/components/template/PageTemplate';

function Stats() {
  const day = getCurrentDateFormatted();

  return (
    <BaseTemplate>
      <>
        <WordsStats day={day} />
        <NavLink
          to="/"
          className="block text-lg font-bold text-center mt-10 py-3 px-6 rounded border border-gray-100 bg-gray-50 dark:bg-gray-600 dark:border-gray-500 w-fit mx-auto mb-5"
        >
          Retourner au jeu
        </NavLink>
      </>
    </BaseTemplate>
  );
}

export default Stats;

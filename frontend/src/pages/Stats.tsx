import { NavBar } from '@/components/molecules';
import WordsStats from '@/components/organisms/WordsStats';
import { NavLink } from 'react-router-dom';
import { getCurrentDateFormatted } from '@/utils/date';

function Stats() {
  const day = getCurrentDateFormatted();

  return (
    <div className="container mx-auto">
      <NavBar />
      <WordsStats day={day} />
      <NavLink
        to="/"
        className="block text-lg font-bold text-center mt-10 py-3 px-6 rounded border border-gray-100 bg-gray-50 dark:bg-gray-600 dark:border-gray-500 w-fit mx-auto"
      >
        Retourner au jeu
      </NavLink>
    </div>
  );
}

export default Stats;

import { Game } from '@/components/organisms';
import { NavLink } from 'react-router-dom';
import { getCurrentDateFormatted } from '@/utils/date';
import BaseTemplate from '@/components/template/PageTemplate';

function Today() {
  const day = getCurrentDateFormatted();

  return (
    <BaseTemplate>
      <>
        <Game day={day} />
        <NavLink
          to="/stats"
          className="block text-lg font-bold text-center mt-10 py-3 px-6 rounded border border-gray-100 bg-gray-50 dark:bg-gray-600 dark:border-gray-500 w-fit mx-auto mb-5"
        >
          Détails
        </NavLink>
      </>
    </BaseTemplate>
  );
}

export default Today;

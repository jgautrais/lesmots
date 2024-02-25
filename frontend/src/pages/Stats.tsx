import { NavBar } from '@/components/molecules';
import WordsStats from '@/components/organisms/WordsStats';
import { NavLink } from 'react-router-dom';

function Stats() {
  const day = new Date().toJSON().slice(0, 10);

  return (
    <div className="container mx-auto">
      <NavBar />
      <WordsStats day={day} />
      <NavLink to="/">
        <h2 className="text-xl font-bold text-center mt-8 py-4">
          Retourner au jeu
        </h2>
      </NavLink>
    </div>
  );
}

export default Stats;

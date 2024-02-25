import { NavBar } from '@/components/molecules';
import { Game } from '@/components/organisms';
import { NavLink } from 'react-router-dom';

function Today() {
  const day = new Date().toJSON().slice(0, 10);

  return (
    <div className="container mx-auto">
      <NavBar />
      <Game day={day} />
      <NavLink to="/stats">
        <h2 className="text-xl font-bold text-center mt-8 py-4">Détails</h2>
      </NavLink>
    </div>
  );
}

export default Today;

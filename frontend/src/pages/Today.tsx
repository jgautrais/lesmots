import { NavBar } from '@/components/molecules';
import { Game } from '@/components/organisms';

function Today() {
  const day = new Date().toJSON().slice(0, 10);

  return (
    <div className="container mx-auto">
      <NavBar />
      <Game day={day} />
    </div>
  );
}

export default Today;

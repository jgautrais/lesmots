import { NavLink } from 'react-router-dom';

function NavBar() {
  return (
    <header className="container mx-auto w-full">
      <NavLink to="/">
        <h1 className="text-4xl font-bold text-center py-8">Les Mots</h1>
      </NavLink>
    </header>
  );
}

export default NavBar;

import { NavLink } from 'react-router-dom';
import useAuthStore from '@/hooks/useAuthStore';

function NavBar() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="container mx-auto w-full">
      <NavLink to="/">
        <h1 className="text-4xl font-bold text-center py-8 font-serif">
          Les Mots
        </h1>
      </NavLink>
      <NavLink
        to={user ? '/profile' : '/login'}
        className="m-2 absolute flex justify-center align-middle right-2 top-6 rounded-full border-2 p-1 bg-gray-50 dark:bg-gray-600 border-gray-100 dark:border-gray-500 text-gray-500 dark:text-gray-100 w-10 h-10"
      >
        {user ? (
          <span className="font-bold text-xl">
            {user.name.slice(0, 1).toUpperCase()}
          </span>
        ) : (
          <svg
            className="h-8 w-8 text-gray-500 dark:text-gray-100"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" />
            <circle cx="12" cy="7" r="4" />
            <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
          </svg>
        )}
      </NavLink>
    </header>
  );
}

export default NavBar;

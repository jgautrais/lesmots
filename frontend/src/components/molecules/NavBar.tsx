import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme, useSwitchTheme } from '@/hooks/theme.store';
import { DarkThemeIcon, LightThemeIcon } from '@/components/atoms';

function NavBar() {
  const theme = useTheme();
  const switchTheme = useSwitchTheme();

  useEffect(() => {
    const localTheme = JSON.parse(localStorage.getItem('theme') ?? '');
    if (localTheme) {
      document.documentElement.setAttribute(
        'data-mode',
        localTheme.state.theme
      );
      document.documentElement.className = localTheme.state.theme;
    }
  }, [theme]);

  return (
    <header className="container mx-auto w-full">
      <NavLink to="/">
        <h1 className="text-4xl font-bold text-center py-8 font-serif">
          Les Mots
        </h1>
      </NavLink>
      <button
        className="absolute top-9 right-4 md:right-8"
        onClick={() => switchTheme()}
      >
        {theme === 'dark' ? (
          <LightThemeIcon className="text-gray-100" />
        ) : (
          <DarkThemeIcon className="text-slate-700" />
        )}
      </button>
    </header>
  );
}

export default NavBar;

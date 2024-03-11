import { createBrowserRouter } from 'react-router-dom';
import { Today, NotFound, Stats, Register, Login, Profile } from '@/pages';
import { MainRouter } from '@/components/organisms';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainRouter />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <Today />,
      },
      {
        path: '/stats',
        element: <Stats />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
    ],
  },
]);

export default router;

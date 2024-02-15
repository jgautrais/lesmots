import { createBrowserRouter } from 'react-router-dom';
import { Game, NotFound } from '@/pages';
import { MainRouter } from '@/components/organisms';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainRouter />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <Game />,
      },
    ],
  },
]);

export default router;

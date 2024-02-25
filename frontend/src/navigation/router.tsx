import { createBrowserRouter } from 'react-router-dom';
import { Today, NotFound, Stats } from '@/pages';
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
    ],
  },
]);

export default router;

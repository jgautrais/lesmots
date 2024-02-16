import { createBrowserRouter } from 'react-router-dom';
import { Today, NotFound } from '@/pages';
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
    ],
  },
]);

export default router;

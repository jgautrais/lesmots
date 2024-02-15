import { useState } from 'react';
import { QueryCache, QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet, useNavigate } from 'react-router-dom';
import { isApiStatusErrors } from '@/types/common';

function MainRouter() {
  const navigate = useNavigate();

  const [queryClient] = useState(
    new QueryClient({
      queryCache: new QueryCache({
        onError: (error) => {
          if (isApiStatusErrors(error)) {
            if (error.response.status === 404) {
              navigate('/not-found');
            }
          }
        },
      }),
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: false,
        },
      },
    })
  );

  const persister = createSyncStoragePersister({
    storage: window.localStorage,
  });

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <Outlet />
      <ReactQueryDevtools initialIsOpen={false} />
    </PersistQueryClientProvider>
  );
}

export default MainRouter;

import ky from 'ky';

export const instance = ky.extend({
  hooks: {
    beforeRequest: [
      (request) => {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('XSRF-TOKEN='))
          ?.split('=')[1];

        request.headers.set('X-XSRF-TOKEN', token ?? '');
      },
    ],
  },
  prefixUrl: import.meta.env.VITE_BACKEND_URL,
  headers: {
    Accept: 'application/json',
  },
  credentials: 'include',
});

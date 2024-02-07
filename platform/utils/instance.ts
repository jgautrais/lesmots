import ky from 'ky';

declare var process : {
    env: {
        NEXT_PUBLIC_API_BASE_URL: string
    }
}

export const instance = ky.extend({
    hooks: {
        beforeRequest: [
            request => {
                const token = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('XSRF-TOKEN='))
                    ?.split('=')[1];

                request.headers.set('X-XSRF-TOKEN', token ?? '');
            }
        ]
    },
    prefixUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        Accept: 'application/json',
    },
    credentials: "include"
});

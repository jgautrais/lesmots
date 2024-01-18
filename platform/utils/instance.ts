import ky from 'ky';

declare var process : {
    env: {
        NEXT_PUBLIC_API_GRANT_TYPE: string,
        NEXT_PUBLIC_API_CLIENT_ID: string,
        NEXT_PUBLIC_API_CLIENT_SECRET: string,
        NEXT_PUBLIC_API_BASE_URL: string
    }
}

export const instance = ky.extend({
    hooks: {
        beforeRequest: [
            async (request) => {
                const token = document.cookie
                    .split('; ')
                    .find((row) => row.startsWith('api_token'))
                    ?.split('=')[1];


                if (token) {
                    request.headers.set('Authorization', `Bearer ${token}`);
                } else {
                    const formData = new FormData();
                    formData.append('grant_type', process.env.NEXT_PUBLIC_API_GRANT_TYPE);
                    formData.append('client_id', process.env.NEXT_PUBLIC_API_CLIENT_ID);
                    formData.append('client_secret', process.env.NEXT_PUBLIC_API_CLIENT_SECRET);
                    try {
                        const apiToken: any = await ky.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth/token`, {
                            body: formData
                        }).json()

                        document.cookie = 'api_token=' + apiToken['access_token']
                    } catch (e) {
                        console.log(e)
                    }
                }
            },
        ],
    },
    prefixUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        Accept: 'application/json',
    },
});

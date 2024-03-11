import { isApiErrors, isKyError } from '@/types/common';
import { RegisterPayload } from '@/types/auth';
import { instance } from '../instance';

export default async (payload: RegisterPayload) => {
  try {
    await instance.get('sanctum/csrf-cookie');
    return await instance
      .post('api/register', { json: payload })
      .json<RegisterPayload>();
  } catch (error) {
    let kyError: unknown = error;
    if (isKyError(error) && error.name === 'HTTPError') {
      kyError = await error.response.json();
    }

    if (isApiErrors(kyError)) {
      return Promise.reject(kyError);
    }

    return Promise.reject(kyError);
  }
};

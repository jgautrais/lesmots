import { isApiErrors, isKyError } from '@/types/common';
import { LoginPayload } from '@/types/auth';
import { User } from '@/types/user';
import { instance } from '../instance';

export default async (payload: LoginPayload) => {
  try {
    await instance.get('sanctum/csrf-cookie');
    return await instance.post('api/login', { json: payload }).json<User>();
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

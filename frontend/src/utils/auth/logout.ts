import { instance } from '../instance';

export default () => {
  return instance.post('api/logout').json();
};

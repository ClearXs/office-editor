import Cookies from 'js-cookie';

/**
 * get token
 */
export const getToken = (): string | undefined => {
  return Cookies.get('X-AUTHENTICATION');
};

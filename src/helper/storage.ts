import config from '../config';

export const accessToken = 'accessToken';
export const refreshToken = 'refreshToken';

export const setItem = (key: string, value: any) => {
  window.localStorage.setItem(key, value);
};

export const getItem = (key: string) => {
  const value = window.localStorage.getItem(key);
  return value === null ? '' : value;
};

export const setToken = (value: string) => {
  setItem(accessToken, value);
};

export const clearToken = () => setToken('');

export const getToken = () => getItem(accessToken);

export const setRefreshToken = (value: string) => {
  setItem(refreshToken, value);
};

export const clearRefreshToken = () => setRefreshToken('');

export const getRefreshToken = () => getItem(refreshToken);

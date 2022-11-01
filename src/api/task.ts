import { sendGet } from './axios';

// eslint-disable-next-line import/prefer-default-export
export const getListTask = (params: any) => sendGet('/v1/app/task/list', params);

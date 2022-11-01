import { sendGet } from './axios';

export const apiGetListUsers = (params: IFilterListUsers) => sendGet('/api/cms/customer/list', params);

export const apiGetUserDetail = (id?: number) => sendGet(`/api/cms/customer/${id}`);

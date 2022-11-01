import { sendGet } from './axios';

export const apiGetListOrders = (params: any) => sendGet('/api/cms/order/list', params);

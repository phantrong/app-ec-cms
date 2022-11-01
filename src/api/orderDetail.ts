import { sendGet } from './axios';

export const apiGetOrderDetail = (params: number) => sendGet(`/api/cms/order/${params}`);
export const EXPORT_ORDER_DETAIL_API = '/api/cms/order/export-pdf/';

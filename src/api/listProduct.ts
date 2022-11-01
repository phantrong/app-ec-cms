import { sendGet, sendPut } from './axios';

export const apiGetListProducts = (params: IFilterListProduct) => sendGet('/api/cms/product/list', params);

export const apiMarkViolation = (params: any) => sendPut(`/api/cms/product/${params.id}/mark-violation`, params);

export const apiUnMarkViolation = (id?: number) => sendPut(`/api/cms/product/${id}/unmark-violation`);

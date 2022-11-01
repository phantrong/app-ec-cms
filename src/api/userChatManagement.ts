import { sendGet } from './axios';

export const apiGetProductDetail = (id?: number) => sendGet(`/api/products/${id}`);
export const apiGetStoreDetail = (storeId?: number) => sendGet(`/api/stores/${storeId}`);
export const apiGetGroupChatInformation = (params: IGetGroupChatInformationParams) =>
  sendGet('/api/cms/group-chat', params);

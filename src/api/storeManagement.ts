import { sendGet, sendPut } from './axios';

export const apiGetListStores = (params: IFilterListStores) => sendGet('/api/cms/store/list', params);

export const apiGetStoreDetail = (id: number) => sendGet(`/api/cms/store/${id}`);

export const apiSettingFeeStore = (params: ISettingFeeStore) =>
  sendPut(`/api/cms/store/${params.id}/setting-commission`, params);

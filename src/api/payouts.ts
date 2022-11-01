import { sendGet } from './axios';

export const apiPayoutHistory = (params?: IParamPaymentHistory) => sendGet(`/api/cms/payouts/history`, params);
export const apiPayoutDetailStore = (payoutId: number) => sendGet(`api/cms/payouts/history/detail/${payoutId}`);
export const apiBankRetrieve = (storeId: number) => sendGet(`api/cms/payouts/retrieve/${storeId}`);

export const apiBankPresent = (storeId: number) => sendGet(`api/cms/store/${storeId}/bank/detail`);

export const apiCountStatusBank = (params: IParamPaymentHistory) =>
  sendGet('/api/cms/payouts/history/count-status', params);

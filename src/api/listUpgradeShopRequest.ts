import { sendGet, sendPost } from './axios';

export const apiGetListUpgradeShopRequest = (filter: IFilterListUpgradeShopRequest) =>
  sendGet('/api/cms/upgrade-account/list', filter);
export const apiGetUpgradeShopRequestDetail = (requestId: number) => sendGet('/api/cms/upgrade-account/' + requestId);
export const apiPostUpgradeShopApproveRequest = (params: IApproveUpgradeShopRequestParams) =>
  sendPost('/api/cms/upgrade-account/approve', params);
export const apiPostUpgradeShopDenyRequest = (params: IApproveUpgradeShopRequestParams) =>
  sendPost('/api/cms/upgrade-account/cancel', params);

export const apiCountStatusUpgradeShopRequest = (params: IFilterListUpgradeShopRequest) =>
  sendGet('/api/cms/upgrade-account/list/count-status', params);

import { sendPut } from './axios';

export const apiChangePasswordSetting = (params: IChangePasswordPostParams) =>
  sendPut('/api/cms/change-password', params);

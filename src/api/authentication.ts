import { sendPost, sendPut } from './axios';

export const login = (payload: ILoginParams) => sendPost('/api/cms/login', payload);
export const forgotPassword = (payload: ICheckMailUniqueParams) => sendPost('/api/cms/reset-password', payload);
export const resendForgotPassword = (payload: ICheckMailUniqueParams) => sendPost('/api/cms/resend-mail', payload);
export const resetPassword = (payload: IResetPasswordParams) =>
  sendPut(`/api/cms/reset-password/${payload.token}`, payload.params);
export const validateLinkResetPassword = (payload: IValidateLinkResetPasswordParams) =>
  sendPost('/api/cms/validate-link/reset-password', payload);

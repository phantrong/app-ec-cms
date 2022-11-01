import { sendGet } from './axios';

export const loadProfile = () => sendGet('/api/cms/me');

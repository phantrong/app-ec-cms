import { sendGet } from './axios';

export const apiGetLiveStreamDetail = (id: string) => sendGet('/api/livestream/' + id);

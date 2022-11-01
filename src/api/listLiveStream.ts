import { sendDelete, sendGet } from './axios';

export const apiGetListLiveStream = (params: IListLiveFilter) => sendGet('/api/cms/livestream/list', params);
export const apiDeleteLiveStream = (id: string | number) => sendDelete('/api/cms/livestream/' + id);

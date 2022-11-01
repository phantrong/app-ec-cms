import { useQuery } from 'react-query';

import { apiGetListLiveStream } from 'api/listLiveStream';
import { GET_LIST_LIVE_STREAM } from 'constants/keyQuery';

export const useListLive = (params: IListLiveFilter) => {
  const { data, isLoading } = useQuery<IListLiveResponse>([GET_LIST_LIVE_STREAM, params], async () => {
    const response = await apiGetListLiveStream(params);
    return response;
  });

  return { ...data, isLoading };
};

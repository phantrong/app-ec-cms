import { useQuery } from 'react-query';

import { apiGetLiveStreamDetail } from 'api/liveStream';
import { USE_GET_LIVE_STREAM_DETAIL } from 'constants/keyQuery';

export const useLiveStreamDetail = (id: string) => {
  const { data, isLoading, isFetched }: LiveStreamDetailInterface = useQuery(
    [USE_GET_LIVE_STREAM_DETAIL, id],
    async () => {
      const response = await apiGetLiveStreamDetail(id);
      return response;
    },
    {
      enabled: !!id,
    }
  );

  return { data, isLoading, isFetched };
};

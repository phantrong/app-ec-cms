import { useQuery } from 'react-query';

import { GET_ALL_STORES, GET_STORE_DETAIL } from 'constants/keyQuery';
import { apiGetListStores, apiGetStoreDetail } from 'api/storeManagement';

export const useListStores = (params: IFilterListStores) => {
  const { data, isLoading } = useQuery<IListStoresResponse>([GET_ALL_STORES, params], async () => {
    const response = await apiGetListStores(params);
    return response;
  });

  return { ...data, isLoading };
};

export const useStoreDetail = (id: number) => {
  const { data, isLoading } = useQuery<IStoreDetailResponse>([GET_STORE_DETAIL, id], async () => {
    const response = await apiGetStoreDetail(id);
    return response;
  });

  return { ...data, isLoading };
};

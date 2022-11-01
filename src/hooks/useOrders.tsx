import { useQuery } from 'react-query';

import { GET_LIST_ORDERS } from 'constants/keyQuery';
import { apiGetListOrders } from 'api/listOrders';

export const useListOrders = (params: IFilterOrders) => {
  const { data, isLoading } = useQuery<IListOrdersResponse>([GET_LIST_ORDERS, params], async () => {
    const response = await apiGetListOrders(params);
    return response;
  });

  return { ...data, isLoading };
};

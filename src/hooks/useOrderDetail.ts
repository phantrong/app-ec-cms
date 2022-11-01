import { useQuery } from 'react-query';

import { apiGetOrderDetail } from 'api/orderDetail';
import { USE_GET_ORDER_DETAIL } from 'constants/keyQuery';

export const useOrderDetail = (params: number) => {
  const { data, isLoading } = useQuery<IDataOrderDetail>([USE_GET_ORDER_DETAIL, params], async () => {
    const response = await apiGetOrderDetail(params);
    return response;
  });

  return { ...data, isLoading };
};

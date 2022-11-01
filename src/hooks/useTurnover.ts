import { useQuery } from 'react-query';

import { getRevenueByAge, getRevenueByBestSales, getRevenueByOrder } from 'api/turnoverManagement';
import { GET_TURNOVER_BY_AGE, GET_TURNOVER_BY_BEST_SALES, GET_TURNOVER_BY_ORDER } from 'constants/keyQuery';

export const useRevenueByOrder = (params: ITurnOverByOrder, isEnable?: boolean) => {
  const { data, isLoading } = useQuery<IResponseTurnoverByOrder>(
    [GET_TURNOVER_BY_ORDER, params, isEnable],
    async () => {
      const response = await getRevenueByOrder(params);
      return response;
    },
    { enabled: isEnable }
  );

  return { ...data, isLoading };
};

export const useRevenueByAge = (params: ITurnOverByOrder) => {
  const { data, isLoading } = useQuery<IResponseTurnoverByAge>([GET_TURNOVER_BY_AGE, params], async () => {
    const response = await getRevenueByAge(params);
    return response;
  });

  return { ...data, isLoading };
};

export const useRevenueByBestSales = (params: ITurnOverByOrder) => {
  const { data, isLoading } = useQuery<IResponseTurnoverByBestSales>([GET_TURNOVER_BY_BEST_SALES, params], async () => {
    const response = await getRevenueByBestSales(params);
    return response;
  });

  return { ...data, isLoading };
};

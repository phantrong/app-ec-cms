import { useQuery } from 'react-query';

import {
  GET_LIST_UPGRADE_SHOP_REQUEST,
  GET_UPGRADE_SHOP_REQUEST_DETAIL,
  GET_UPGRADE_SHOP_REQUEST_STATUS_COUNT,
} from 'constants/keyQuery';
import {
  apiCountStatusUpgradeShopRequest,
  apiGetListUpgradeShopRequest,
  apiGetUpgradeShopRequestDetail,
} from 'api/listUpgradeShopRequest';

export const useGetListUpgradeShopRequest = (isAuthenticated: boolean, filter: IFilterListUpgradeShopRequest) => {
  const { data, isLoading } = useQuery<IListUpgradeShopRequestResponseData>(
    [GET_LIST_UPGRADE_SHOP_REQUEST, filter],
    async () => {
      const response = await apiGetListUpgradeShopRequest(filter);
      return response;
    },
    {
      enabled: isAuthenticated,
    }
  );
  return { ...data, isLoading };
};

export const useGetUpgradeShopRequestDetail = (isAuthenticated: boolean, requestId: number) => {
  const { data, isLoading } = useQuery<IUpgradeShopRequestDetailResponseData>(
    [GET_UPGRADE_SHOP_REQUEST_DETAIL, requestId],
    async () => {
      const response = await apiGetUpgradeShopRequestDetail(requestId);
      return response;
    },
    {
      enabled: !!requestId && isAuthenticated,
    }
  );
  return { ...data, isLoading };
};

export const useCountStatusUpgradeShopRequest = (params: IFilterListUpgradeShopRequest) => {
  const { data, isLoading, isFetching } = useQuery<IUpgradeShopRequestCountResponse>(
    [GET_UPGRADE_SHOP_REQUEST_STATUS_COUNT, params],
    async () => {
      const response = await apiCountStatusUpgradeShopRequest(params);
      return response;
    }
  );

  return { ...data, isLoading, isFetching };
};

import { useQuery } from 'react-query';

import { GET_DETAIL_PRODUCT, GET_GROUP_CHAT_MESSENGER, GET_STORE_DETAIL } from 'constants/keyQuery';
import { apiGetGroupChatInformation, apiGetProductDetail, apiGetStoreDetail } from 'api/userChatManagement';

export const useDetailProduct = (id?: number) => {
  const { data, isLoading } = useQuery<IProductDetailResponse>(
    [GET_DETAIL_PRODUCT, id],
    async () => {
      const response = await apiGetProductDetail(id);
      return response;
    },
    { enabled: id ? true : false }
  );
  return { ...data, isLoading };
};

export const useStoreDetail = (storeId?: number) => {
  const { data, isLoading }: IStoreBasicDetailResponse = useQuery(
    [GET_STORE_DETAIL, storeId],
    async () => {
      const response = await apiGetStoreDetail(storeId);
      return response;
    },
    {
      enabled: !!storeId,
    }
  );

  return { ...data, isLoading };
};

export const useGetGroupChatInformation = (params: IGetGroupChatInformationParams) => {
  const { data, isLoading } = useQuery<IGetGroupChatInformationDataResponse>(
    [GET_GROUP_CHAT_MESSENGER, params],
    async () => {
      const response = await apiGetGroupChatInformation(params);
      return response;
    },
    {
      enabled: params.store.length > 0 || params.user.length > 0,
    }
  );
  return { ...data, isLoading };
};

import { useQuery } from 'react-query';

import { apiGetListUsers, apiGetUserDetail } from 'api/userManagement';
import { GET_ALL_USERS, GET_USER_DETAIL } from 'constants/keyQuery';

export const useListUsers = (params: IFilterListUsers) => {
  const { data, isLoading } = useQuery<IListUsersResponse>([GET_ALL_USERS, params], async () => {
    const response = await apiGetListUsers(params);
    return response;
  });

  return { ...data, isLoading };
};

export const useUserDetail = (id?: number) => {
  const { data, isLoading } = useQuery<IUserDetailResponse>(
    [GET_USER_DETAIL, id],
    async () => {
      const response = await apiGetUserDetail(id);
      return response;
    },
    {
      enabled: !!id,
    }
  );

  return { ...data, isLoading };
};

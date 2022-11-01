import { useQuery } from 'react-query';
import { GET_CATEGORY_DETAIL, GET_LIST_CATEGORY } from 'constants/keyQuery';
import { apiGetCategoryDetail, apiGetListCategory } from 'api/listCategory';

export const useGetListCategory = (isAuthenticated: boolean, filter: IFilterListCategory) => {
  const { data, isLoading } = useQuery<IResponseDataListCategory>(
    [GET_LIST_CATEGORY, filter],
    async () => {
      const response = await apiGetListCategory(filter);
      return response;
    },
    {
      enabled: isAuthenticated,
    }
  );
  return { ...data, isLoading };
};

export const useGetCategoryDetail = (isAuthenticated: boolean, categoryId: number, filter: IFilterListCategory) => {
  const { data, isLoading } = useQuery<IResponseDataCategoryDetail>(
    [GET_CATEGORY_DETAIL, categoryId, filter],
    async () => {
      const response = await apiGetCategoryDetail(categoryId, filter);
      return response;
    },
    {
      enabled: !!categoryId && isAuthenticated,
    }
  );
  return { ...data, isLoading };
};

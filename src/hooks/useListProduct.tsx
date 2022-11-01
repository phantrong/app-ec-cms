import { apiGetListProducts } from 'api/listProduct';
import { GET_LIST_PRODUCT } from 'constants/keyQuery';
import { useQuery } from 'react-query';

export const useListProduct = (params: IFilterListProduct) => {
  const { data, isLoading } = useQuery<IDataListProduct>([GET_LIST_PRODUCT, params], async () => {
    const response = await apiGetListProducts(params);
    return response;
  });

  return { ...data, isLoading };
};

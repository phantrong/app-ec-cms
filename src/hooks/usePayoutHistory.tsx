import { useQuery } from 'react-query';

import {
  apiBankPresent,
  apiBankRetrieve,
  apiCountStatusBank,
  apiPayoutDetailStore,
  apiPayoutHistory,
} from 'api/payouts';
import {
  GET_BANK_COUNT_STATUS,
  GET_BANK_PRESENT_STORE,
  GET_BANK_RETRIEVE_STORE,
  GET_TURNOVER_PAYOUT_DETAIL_STORE,
  GET_TURNOVER_PAYOUT_HISTORY,
} from 'constants/keyQuery';

export const usePaymentHistory = (params: IParamPaymentHistory) => {
  const { data, isLoading } = useQuery<IResponsePayoutHistory>([GET_TURNOVER_PAYOUT_HISTORY, params], async () => {
    const response = await apiPayoutHistory(params);
    return response;
  });

  return { ...data, isLoading };
};

export const usePayoutDetailStore = (payoutId: number) => {
  const { data, isLoading }: IResponsePayoutDetail = useQuery(
    [GET_TURNOVER_PAYOUT_DETAIL_STORE, payoutId],
    async () => {
      const response = await apiPayoutDetailStore(payoutId);
      return response;
    },
    {
      enabled: !!payoutId,
    }
  );

  return { ...data, isLoading };
};

export const useBankPresent = (storeId: number) => {
  const { data, isLoading }: IResponseBankPresentStore = useQuery(
    [GET_BANK_PRESENT_STORE, storeId],
    async () => {
      const response = await apiBankPresent(storeId);
      return response;
    },
    {
      enabled: !!storeId,
    }
  );

  return { ...data, isLoading };
};

export const useBankRetrieve = (storeId: number) => {
  const { data, isLoading }: IResponseBankRetrieve = useQuery(
    [GET_BANK_RETRIEVE_STORE, storeId],
    async () => {
      const response = await apiBankRetrieve(storeId);
      return response;
    },
    {
      enabled: !!storeId,
    }
  );

  return { ...data, isLoading };
};

export const useBankCountStatus = (params: IParamPaymentHistory) => {
  const { data, isLoading } = useQuery<IWithdrawCountStatusResponse>([GET_BANK_COUNT_STATUS, params], async () => {
    const response = await apiCountStatusBank(params);
    return response;
  });

  return { ...data, isLoading };
};

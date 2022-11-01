import { useQuery } from 'react-query';
import { GET_CMS_PROFILE } from 'constants/keyQuery';
import { loadProfile } from 'api/profile';

export default function useProfile(isAuthenticated: boolean) {
  const { data, isLoading }: ICmsProfileResponse = useQuery(GET_CMS_PROFILE, loadProfile, {
    enabled: isAuthenticated,
  });

  return { ...data, isLoading };
}

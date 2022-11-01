import { useQuery } from 'react-query';

export default function useToggleSideNav() {
  const { data }: any = useQuery('showSideNav');
  return data;
}

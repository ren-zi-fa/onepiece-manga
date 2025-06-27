/* eslint-disable  @typescript-eslint/no-unused-vars */

import useSWR from 'swr';
import { fetcher } from '@/lib/utils';

import { VolumeDataResponse } from '@/types';
import { useVolumeStore } from '@/store/volumeStore';

export const useVolume = (page: string) => {
  const setData = useVolumeStore((s) => s.setData);
  const storedData = useVolumeStore((s) => s.data);

  const shouldFetch = !storedData || storedData.page !== Number(page);

  const { data, error, isLoading } = useSWR<VolumeDataResponse>(
    shouldFetch ? `/api/home?page=${page}` : null,
    fetcher,
    {
      onSuccess: (data) => setData(data),
    }
  );

  return {
    data: storedData,
    error,
    isLoading,
  };
};

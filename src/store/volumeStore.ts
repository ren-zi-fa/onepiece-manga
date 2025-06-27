// store/useVolumeStore.ts
import { create } from 'zustand';
import { VolumeDataResponse } from '@/types';

type VolumeState = {
  data: VolumeDataResponse | null;
  setData: (data: VolumeDataResponse) => void;
};

export const useVolumeStore = create<VolumeState>((set) => ({
  data: null,
  setData: (data) => set({ data }),
}));

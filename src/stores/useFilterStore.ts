import { create } from 'zustand';

interface Props {
  brightness: number;
  contrast: number;
  setBrightness: (brightness: number) => void;
  setContrast: (contrast: number) => void;
}

const useFilterStore = create<Props>((set) => ({
  brightness: 0,
  contrast: 0,
  setBrightness: (brightness) => set({ brightness }),
  setContrast: (contrast) => set({ contrast }),
}));

export default useFilterStore;

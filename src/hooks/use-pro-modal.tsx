import { create } from "zustand";

interface useProModalStore {
  isPro: boolean;
  setIsPro: (isProValue: boolean) => void;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useProModal = create<useProModalStore>((set) => ({
  isPro: false,
  setIsPro: (isProValue: boolean) => set({ isPro: isProValue }),
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

import { create } from 'zustand';

export const ModalNames = {
  NEW_ENTRY: 'NEW_ENTRY',
  EDIT_ENTRY: 'EDIT_ENTRY',
  FOOD_LOG_MENU: 'FOOD_LOG_MENU',
} as const;

export type ModalName = keyof typeof ModalNames;

type SnapPoints = string[];
type ModalParams = { [key: string]: unknown };
type ActiveModal = { name: ModalName; snapPoints?: SnapPoints; params?: ModalParams };

type ModalState = {
  isModalActive: boolean;
  activeModal: ActiveModal | null;
  openModal: (params: ActiveModal) => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalState>(set => ({
  isModalActive: false,
  activeModal: null,
  openModal: ({ name, snapPoints, params }) => {
    set(() => ({
      isModalActive: true,
      activeModal: { name, snapPoints: snapPoints ?? undefined, params },
    }));
  },
  closeModal: () => set(() => ({ isModalActive: false, activeModal: null })),
}));

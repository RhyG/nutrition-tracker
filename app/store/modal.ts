import { create } from 'zustand';

export const ModalNames = {
  NEW_ENTRY: 'NEW_ENTRY',
  EDIT_ENTRY: 'EDIT_ENTRY',
} as const;

export type ModalName = keyof typeof ModalNames;

type SnapPoints = string[];
type ModalParams = { [key: string]: unknown };
type ActiveModal = { name: ModalName; snapPoints?: SnapPoints; params?: ModalParams };

type ModalState = {
  isModalActive: boolean;
  activeModal: ActiveModal | null;
  setActiveModal: (params: ActiveModal) => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalState>(set => ({
  isModalActive: false,
  activeModal: null,
  setActiveModal: ({ name, snapPoints, params }) => {
    set(() => ({
      isModalActive: true,
      activeModal: { name, snapPoints: snapPoints ?? undefined, ...params },
    }));
  },
  closeModal: () => set(() => ({ isModalActive: false, activeModal: null })),
}));

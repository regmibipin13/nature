import { create } from "zustand";

// ✅ update your zustand store types
interface AlertDialogState {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm?: () => Promise<void> | void; // allow async
  openDialog: (options: {
    title: string;
    description: string;
    onConfirm?: () => Promise<void> | void;
  }) => void;
  closeDialog: () => void;
}

export const useAlertDialog = create<AlertDialogState>((set) => ({
  isOpen: false,
  title: "",
  description: "",
  onConfirm: undefined,
  openDialog: ({ title, description, onConfirm }) =>
    set({ isOpen: true, title, description, onConfirm }),
  closeDialog: () =>
    set({ isOpen: false, title: "", description: "", onConfirm: undefined }),
}));

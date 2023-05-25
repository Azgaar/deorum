export type TOptions = {
  title: string;
  body: string;
  confirmButton?: string;
  cancelButton?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export const dialog = {
  open: (detail: TOptions) => {
    window.dispatchEvent(new CustomEvent('dialogOpen', { detail }));
  },
  close: () => {
    window.dispatchEvent(new CustomEvent('dialogClose'));
  }
};

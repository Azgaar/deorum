export type TOptions = {
  title: string;
  body: string;
  confirmButton?: string;
  cancelButton?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

const dialog = {
  open: (detail: TOptions) => {
    window.dispatchEvent(new CustomEvent('dialogOpen', { detail }));
  },
  close: () => {
    window.dispatchEvent(new CustomEvent('dialogClose'));
  }
};

export const confirmationDialog = {
  open: ({ onConfirm, onCancel }: Pick<TOptions, 'onConfirm' | 'onCancel'>) => {
    dialog.open({
      title: 'common.dialog.confirmation.title',
      body: 'common.dialog.confirmation.body',
      confirmButton: 'common.dialog.confirmation.confirm',
      cancelButton: 'common.dialog.confirmation.cancel',
      onConfirm,
      onCancel
    });
  }
};

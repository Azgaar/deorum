import { t } from '$lib/locales/translations';

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

export const confirmationDialog = {
  open: ({ onConfirm, onCancel }: Pick<TOptions, 'onConfirm' | 'onCancel'>) => {
    dialog.open({
      title: t.get('common.dialog.confirmation.title'),
      body: t.get('common.dialog.confirmation.body'),
      confirmButton: t.get('common.dialog.confirmation.confirm'),
      cancelButton: t.get('common.dialog.confirmation.cancel'),
      onConfirm,
      onCancel
    });
  }
};

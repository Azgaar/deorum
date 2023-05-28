import { REGISTRATION_BONUS, PATREON_COIN_PRICE_USD } from '$lib/config/coins';
import { t } from '$lib/locales/translations';

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

export const requestConfirmation = ({
  onConfirm,
  onCancel
}: Pick<TOptions, 'onConfirm' | 'onCancel'>) => {
  dialog.open({
    title: t.get('common.dialog.confirmation.title'),
    body: t.get('common.dialog.confirmation.body'),
    confirmButton: t.get('common.dialog.confirmation.confirm'),
    cancelButton: t.get('common.dialog.confirmation.cancel'),
    onConfirm,
    onCancel
  });
};

export const openGetCoinsDialog = (coinsLeft: number) => {
  dialog.open({
    title: t.get('common.coins.coinsLeft', { variable: coinsLeft }),
    body: `
      <div>${t.get('common.coins.description.1', { variable: REGISTRATION_BONUS })}</div>
      <div>${t.get('common.coins.description.2', { variable: PATREON_COIN_PRICE_USD })}</div>
      <div>${t.get('common.coins.description.3')}</div>
    `,
    confirmButton: t.get('common.coins.openPatreon'),
    onConfirm: () => window.open('https://www.patreon.com/azgaar', '_blank'),
    cancelButton: t.get('common.controls.close')
  });
};

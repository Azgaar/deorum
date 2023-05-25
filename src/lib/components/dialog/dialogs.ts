import { REGISTRATION_BONUS, PATREON_COIN_PRICE_USD } from '$lib/config/coins';
import { t } from '$lib/locales/translations';
import { dialog, type TOptions } from './dialog';

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

export const getCoinsDialog = (coinsLeft: number) => {
  dialog.open({
    title: t.get('common.coins.coinsLeft', { variable: coinsLeft }),
    body: `
      <p>${t.get('common.coins.description.1', { variable: REGISTRATION_BONUS })}</p>
      <p>${t.get('common.coins.description.2', { variable: PATREON_COIN_PRICE_USD })}</p>
      <p>${t.get('common.coins.description.3')}</p>
    `,
    confirmButton: t.get('common.coins.openPatreon'),
    onConfirm: () => window.open('https://www.patreon.com/azgaar', '_blank'),
    cancelButton: t.get('common.controls.close')
  });
};

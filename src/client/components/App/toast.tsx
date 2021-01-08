import { f7 } from 'framework7-react';
import { Toast } from 'framework7/types';

let toastInstances: Record<string, Toast.Toast> = {};

export function toast(
  text: string,
  opts?: {
    position?: 'top' | 'center' | 'bottom';
    closeTimeout?: number;
  }
) {
  const ins =
    toastInstances[text] ??
    f7.toast.create({
      text,
      position: 'center',
      closeTimeout: 1500,
      ...opts,
    });

  toastInstances[text] = ins;

  ins.open();
}

import { Billetera, mockBilletera } from './mockDatabase';

export const getBilletera = async (): Promise<Billetera> => {
  console.log('Mock API: getBilletera()');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockBilletera);
    }, 300);
  });
};
import { Promocion, mockPromociones } from './mockDatabase';

export const getPromociones = async (): Promise<Promocion[]> => {
  console.log('Mock API: getPromociones()');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPromociones);
    }, 700);
  });
};
import { 
  Potenciador, 
  mockPotenciadores,
  mockBilletera
} from './mockDatabase';

export const getPotenciadores = async (): Promise<Potenciador[]> => {
  console.log('Mock API: getPotenciadores()');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPotenciadores);
    }, 500);
  });
};

export const comprarPotenciador = async (potenciador: Potenciador): Promise<{ success: boolean, message: string }> => {
  console.log('Mock API: comprarPotenciador()', potenciador);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      if (mockBilletera.saldo_actual >= potenciador.precio_tokens) {
        mockBilletera.saldo_actual -= potenciador.precio_tokens;
        console.log('¡Gasto simulado! Nuevo saldo:', mockBilletera.saldo_actual);
        resolve({ success: true, message: '¡Potenciador comprado!' });
      } else {
        console.log('Gasto simulado fallido: fondos insuficientes');
        resolve({ success: false, message: 'No tienes suficientes tokens.' });
      }
    }, 1000);
  });
};
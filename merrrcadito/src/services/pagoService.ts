import { 
  TokenPackage, 
  mockTokenPackages,
  mockBilletera
} from './mockDatabase';

export const getTokenPackages = async (): Promise<TokenPackage[]> => {
  console.log('Mock API: getTokenPackages()');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTokenPackages);
    }, 500);
  });
};

export const simularCompraTokens = async (paquete: TokenPackage): Promise<{ success: boolean }> => {
  console.log('Mock API: simularCompraTokens()', paquete);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      mockBilletera.saldo_actual += paquete.tokens;
      console.log('¡Compra simulada! Nuevo saldo:', mockBilletera.saldo_actual);
      
      resolve({ success: true });
    }, 1000);
  });
};
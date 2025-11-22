export const mapCodRolToRole = (cod_rol: number): 'admin' | 'user' => {
  if (cod_rol === 3) return 'admin';  
  return 'user';  
};
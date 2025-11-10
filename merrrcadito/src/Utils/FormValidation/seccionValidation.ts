export const SeccionValidators = {
  nombre: (value: string): string | null => {
    if (value.length <= 2) {
      return 'No puede ser menos de 3 caracteres';
    }
    if (!/^[a-zA-Z]+$/.test(value)) {
      return 'No puede ser un numero o signos';
    }
    return null;
  },
  
  descripcion: (value: string): string | null => {
    if (value.length < 10) {
      return 'Debe ser una descripción más detallada';
    } 
    if (value.length > 200) {
      return 'Debe ser una descripción directa'
    }
    if (!/^[a-zA-Z]+$/.test(value)) {
      return 'No puede ser un numero o signos';
    }
    return null;
  },
  
};
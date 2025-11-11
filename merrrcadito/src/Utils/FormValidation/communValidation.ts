export const CommunValidators = {
  required: (value: any): string | null => {
    if (value === '' || value === null || value === undefined) {
      return 'Por favor complete el campo';
    }
    return null;
  }
}
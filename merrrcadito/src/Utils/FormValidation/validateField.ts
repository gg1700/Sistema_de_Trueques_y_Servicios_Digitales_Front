export const ValidateField = (
  value: any, 
  validators: ((value: any) => string | null)[]
): string | null => {
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return null;
};
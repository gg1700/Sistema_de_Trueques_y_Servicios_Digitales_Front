import styles from './FormField.module.css';
import {Label} from '../../Atoms';

interface FormFieldProps {
  htmlFor: string;
  label: string;
  error?: string,
  children: React.ReactNode;
  required?: boolean;
}

export default function FormField({ 
  htmlFor, 
  label, 
  error,
  children, 
  required = false 
}: FormFieldProps) {
  return (
    <div className={styles.formField}>
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>
      {children}
      {error && <span className={styles.errorMessage}>{error}</span>} 
    </div>
  );
}
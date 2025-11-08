import styles from './Label.module.css';

interface LabelProps {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}

export default function Label({ 
  htmlFor, 
  children, 
  required = false 
}: LabelProps) {
  return (
    <label 
      htmlFor={htmlFor} 
      className={styles.label}
    >
      {children}
      {required && <span className={styles.required}> *</span>}
    </label>
  );
}
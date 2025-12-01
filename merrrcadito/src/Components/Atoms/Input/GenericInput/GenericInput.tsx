import styles from './GenericInput.module.css';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'datetime-local' | 'number';
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  min?: string;
  max?: string;
  accept?: string;
}

export default function GenericInput({
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  error = false,
  min,
  max,
  accept,
}: InputProps) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      min={min}
      max={max}
      accept={accept}
      className={`${styles.input} ${error ? styles.inputError : ''}`}
    />
  );
}
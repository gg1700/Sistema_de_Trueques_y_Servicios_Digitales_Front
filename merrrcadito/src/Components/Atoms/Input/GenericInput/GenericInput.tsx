import styles from './GenericInput.module.css';

interface InputProps {
  type?: 'text' | 'email' | 'password';
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
}

export default function GenericInput({
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  error = false,
}: InputProps) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`${styles.input} ${error ? styles.inputError : ''}`}
    />
  );
}
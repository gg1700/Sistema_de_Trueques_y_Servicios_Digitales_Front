import styles from './AreaInput.module.css';

interface TextareaProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  error?: boolean;
}

export default function AreaInput({
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  disabled = false,
  error = false
}: TextareaProps) {
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className={`${styles.textarea} ${error ? styles.textareaError : ''}`}
    />
  );
}
import styles from './SelectInput.module.css'


interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  isLoading?: boolean;
}

export default function SelectInput({
  name,
  value,
  onChange,
  options,
  placeholder = "Seleccione una opción",
  disabled = false,
  error = false,
}:SelectProps){
    return (
        <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`${styles.select} ${error ? styles.selectError : ''}`}
        >
        <option value="" disabled hidden>{placeholder}</option>
        {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
        ))}
        </select>
  );
}
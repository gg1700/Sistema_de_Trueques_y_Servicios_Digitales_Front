import styles from './ProfileInput.module.css'

interface ProfileInputProps {
    type: 'text' | 'date'; 
    name: string;                            
    value: string | number;                         
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;//Ver si se mantiene 
    placeholder?: string;                    
    disabled?: boolean;                    
    required?: boolean;                      
}

export default function ProfileInput({
    type = 'text',
    name,
    value,
    onChange,
    placeholder,
    disabled = false,
    required = false
}: ProfileInputProps) {
    return(
        <input 
           type={type}
           name={name}
           value={value}
           onChange={onChange}
           placeholder={placeholder}
           disabled={disabled}
           required={required}
           className={styles.profileInput}
        />
    );
}
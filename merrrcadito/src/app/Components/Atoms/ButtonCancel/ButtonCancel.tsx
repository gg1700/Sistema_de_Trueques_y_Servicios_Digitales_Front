import styles from './ButtonCancel.module.css';

interface ButtonCancelProps {
    onClick?: () => void;
    disabled?: boolean;
}

export default function ButtonCancel({ 
    onClick, 
    disabled = false 
}: ButtonCancelProps) {
    return (
        <button
            type="button"
            className={styles.buttonCancel}
            onClick={onClick}
            disabled={disabled}
        >
            Cancelar
        </button>
    );
}
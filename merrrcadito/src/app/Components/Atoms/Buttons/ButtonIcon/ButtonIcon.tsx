import styles from './ButtonIcon.module.css'


interface ButtonIconProps {
    icon: string;
    type: 'update' | 'delete' | 'default' | 'burguer' | 'profile';
    onClick: () => void;
    disabled?: boolean;
    name: string;
}


export default function ButtonIcon({
    icon,
    type= 'default',
    onClick,
    disabled= false,
    name
}:ButtonIconProps){

    const getTypeClass = () => {
        switch (type) {
            case 'update':
                return styles.update;
            case 'delete':
                return styles.delete;
            case 'burguer':
                return styles.burguer;
            case 'profile':
                return styles.profile;
            default:
                return styles.default;
        }
    };

    return(
        <div className={styles.acciones}>
            <button
                className={`${styles.btnAccion} ${getTypeClass()}`}
                onClick={onClick}
                disabled={disabled}
                title={name}
                type="button"
            >
                <i className={`bi ${icon}`}></i>
            </button>
        </div>
    );
}
import styles from './ButtonNav.module.css'

interface ButtonNavProps{
    name: string,
    isActive?: boolean;
    disabled?: boolean;
    onClick: () => void
}


export default function ButtonNav({
    name,
    isActive,
    disabled,
    onClick
}:ButtonNavProps){
    return(
        <button className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                disabled={disabled}
                onClick={onClick}
        >
            {name}
        </button>
    );
}

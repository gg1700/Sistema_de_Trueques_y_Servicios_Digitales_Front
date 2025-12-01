import styles from './ButtonForm.module.css'

interface ButtonFormProps {
    type: 'submit' | 'cancel' | 'delete' | 'open' | 'buy'
    action: 'register' | 'delete' | 'update' | 'publish' | 'watch' | 'buy'
    entity: 'category' | 'subcategory' | 'user' | 'publication' | 'promotion'
    disabled?: boolean
    onClick?: () => void
    children?: React.ReactNode
}
export default function ButtonForm({
    type,
    action,
    entity = 'subcategory',
    disabled = false,
    onClick,
    children,
}: ButtonFormProps) {


    const getButtonText = () => {

        const actions = {
            register: 'Registrar',
            update: 'Actualizar',
            delete: 'Eliminar',
            publish: 'Publicar',
            watch: 'Ver más',
            buy: 'Adquirir'
        };

        const entities = {
            category: 'Categoría',
            subcategory: 'Subcategoría',
            user: 'Usuario',
            publication: '',
            promotion: 'Promoción'
        };

        if (type == 'cancel') {
            return 'Cancelar';
        };

        return `${actions[action]} ${entities[entity]}`;
    };

    const getVariant = () => {
        switch (type) {
            case 'submit': return 'primary';
            case 'cancel': return 'secondary';
            case 'delete': return 'danger';
            default: return 'primary';
        }
    };



    return (
        <button
            type={type === 'submit' ? 'submit' : 'button'}
            className={`${styles.buttonForm} ${styles[getVariant()]}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children || getButtonText()}
        </button>
    );
}
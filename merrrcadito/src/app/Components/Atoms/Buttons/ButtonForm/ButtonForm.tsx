import styles from './ButtonForm.module.css'

interface ButtonFormProps{
    type: 'submit' | 'cancel' | 'delete'
    action: 'register' | 'delete' | 'update'
    entity: 'category' | 'subcategory'
    disabled?: boolean
    onClick?: () => void

}
export default function ButtonForm({
  type,
  action,
  entity = 'subcategory',
  disabled=false,
  onClick,
}: ButtonFormProps){


    const getButtonText = () =>{

        const actions = {
        register: 'Registrar',
        update: 'Actualizar', 
        delete: 'Eliminar'
        };

        const entities = {
        category: 'Categoría',
        subcategory: 'Subcategoría',
        };

        if(type=='cancel'){
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



    return(
        <button
            type={type === 'submit' ? 'submit' : 'button'}
            className={`${styles.buttonForm} ${styles[getVariant()]}`}
            onClick={onClick}
            disabled={disabled}
            >
            {getButtonText()}
        </button>
    );
}
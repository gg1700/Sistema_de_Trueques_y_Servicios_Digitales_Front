import styles from './ButtonForm.module.css'

interface ButtonFormProps{
    type: 'submit' | 'cancel' | 'delete' | 'open'
    action: 'register' | 'delete' | 'update' | 'publish' | 'watch'
    entity: 'category' | 'subcategory' | 'user' | 'publication'
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
        delete: 'Eliminar',
        publish: 'Publicar',
        watch: 'Ver más'
        };

        const entities = {
        category: 'Categoría',
        subcategory: 'Subcategoría',
        user: 'Usuario',
        publication: ''
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
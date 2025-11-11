export const PublicationValidators ={
    nombreProd : (value : string ) : string | null  => {
        if (value.length <= 2) {
            return 'No puede ser menos de 3 caracteres';
        }
        return null;
    },
    peso : (value : string) : string | null => {
        if(value == "0") {
            return 'Valor no valido';
        }
        return null;
    },
    descripcion : (value : string) : string | null => {
        if(value.length <= 5){
            return 'Debe ser una descripcion más precisa';
        }
        return null;
    },
    precio : (value : string) : string | null => {
        if(value == "0"){
            return 'Precio no valido';
        }
        return null;
    }
}
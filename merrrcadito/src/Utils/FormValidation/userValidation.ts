export const UserValidators = {
  handleName: (value: string): string | null => {
    if (value.length <= 5) {
      return 'No puede ser menos de 5 caracteres';
    }
    if (!/^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/.test(value)) {
        return 'Debe contener al menos una letra';
    }
    return null;
  },
  nombre: (value:string): string | null => {
    if (value.length <=1 || value.length >=15) {
        return 'Implemente un nombre real';
    }
    if (!/^[a-zA-Z]+(?:\s+[a-zA-Z]+)+$/.test(value)) {
        return 'Numeros o signos no permitidos';
    }
    return null;
  },
  apellidoPaterno: (value:string): string | null => {
    if (value.length <=1 || value.length >=15) {
        return 'Implemente un apellido real';
    }
    if (!/^[a-zA-Z]+$/.test(value)) {
        return 'Numeros o signos no permitidos';
    }
    return null;
  },
  apellidoMaterno: (value:string): string | null => {
    if (value.length <=1 || value.length >=15) {
        return 'Implemente un apellido real';
    }
    if (!/^[a-zA-Z]+$/.test(value)) {
        return 'Numeros o signos no permitidos';
    }
    return null;
  },
  correoElectronico: (value:string): string | null => {
    if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
        return 'Correo electronico no valido';
    }
    return null;
  },
  fechaNacimiento: (value:string): string | null => {
    const fechaNac = new Date(value);
    const hoy = new Date();

    if(fechaNac >= hoy) {
        return 'Fecha no valida';
    }

    const edad = hoy.getFullYear() - fechaNac.getFullYear();
    if (edad > 100) {
        return 'Fecha no válida';
    }
    return null;
  },
  numeroTelf: (value: string): string | null => {
    if (!/^[0-9]{8}$/.test(String(value))) {
        return 'Número no válido';
    }
    return null;
  },
  ci: (value: string): string | null => {
    if(!/^[0-9]{9}$/.test(String(value))) {
        return 'C.I. no valido';
    }
    return null;
  }
}
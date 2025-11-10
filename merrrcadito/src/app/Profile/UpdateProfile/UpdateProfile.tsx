'use client'
import {FormProfile} from '@/Components/Organisms'

interface  UserDataProps{
    initialData:{
        handleName: string,
        nombre: string,
        apellidoPaterno: string,
        apellidoMaterno: string,
        rol: string,
        correoElectronico: string,
        fechaNacimiento: string,
        numeroTelf: string,
        ci: string,
    }
}

export default  function UpdateProfile(){
    const userData={
        handleName:"ElPapu",
        nombre:"Alfonso",
        apellidoPaterno:"Chuño",
        apellidoMaterno:"Torrales",
        rol:"Usuario Comun",
        correoElectronico:"nepe@gmail.com",
        fechaNacimiento:'02-02-2002',
        numeroTelf:"625472",
        ci:"999999"
    }
    

    return(
        <FormProfile initialData={userData}/>
    );


}

import MenuDesplegable from './Components/MenuDesplegable'

export default function paginaPrincipal(){
  return(
    <>
      <div className="bg-red-500 p-4 text-white font-bold text-center">
            ✅ Si esto se ve rojo, Tailwind funciona
        </div>
      <MenuDesplegable />
      <button>Registrar</button>
      <br></br>
      <button>Iniciar sesion</button>
      <br></br>
      <br></br>
      <button><i className="bi bi-trash"></i></button>
    </>
  );
}
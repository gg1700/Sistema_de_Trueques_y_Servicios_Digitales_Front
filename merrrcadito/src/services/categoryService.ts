import axios from 'axios';

const API_BASE_URL=process.env.BACK_URL;

const endpoint1='category/get_all';
const endpoint2='category/register';
const endpoint3='category/update';

export const CategoryService = {
    
    getAllCategory: async () =>{
        try{
            const response= await axios.get(
                API_BASE_URL + endpoint1,
            );

            console.log("Categorías obtenidas:", response.data);
            return response.data;
        }catch(error){
            console.error("Error al obtener las categorias");
        }

    },
    registerCategory: async (categoryData:{
        nom_cat: string;
        descr_cat: string;
        imagen_repr: File | Blob; 
        tipo_cat: string;
    }) => {
        try{
            const formData = new FormData();
            formData.append('nom_cat', categoryData.nom_cat);
            formData.append('descr_cat', categoryData.descr_cat);
            formData.append('imagen_repr', categoryData.imagen_repr);
            formData.append('tipo_cat', categoryData.tipo_cat);

            const response = await axios.post(
                API_BASE_URL + endpoint2,
                formData,
                {
                    headers: {
                    'Content-Type': 'multipart/form-data'  
                    }
                }
            );

            return response.data;
        }catch(error:any){
            console.error('Error registrando categoria:', error);
            throw new Error(error.response?.data?.error || 'Error al registrar categoría');
        }
    },
    updateCategory: async (cod_cat: number, attributes: {
        nom_cat?: string;
        descr_cat?: string;
        imagen_repr?: File | Blob;
        tipo_cat?: string;
    }) => {
        try {
            const formData = new FormData();
            
            if (attributes.nom_cat) formData.append('nom_cat', attributes.nom_cat);
            if (attributes.descr_cat) formData.append('descr_cat', attributes.descr_cat);
            if (attributes.imagen_repr) formData.append('imagen_repr', attributes.imagen_repr);
            if (attributes.tipo_cat) formData.append('tipo_cat', attributes.tipo_cat);

            const response = await axios.put(
                `${API_BASE_URL}/category/update?cod_cat=${cod_cat}`,
                formData,
                {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                }
            );

            return response.data;
        }catch (error: any) {
            console.error('Error actualizando categoria:', error);
            throw new Error(error.response?.data?.message || 'Error al actualizar categoría');
        }
    }
}
   
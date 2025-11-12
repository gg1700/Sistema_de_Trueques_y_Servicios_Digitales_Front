import axios from 'axios';
import * as dotenv from 'dotenv';

const API_BASE_URL=process.env.NEXT_PUBLIC_BACK_URL;;

const endpoint1='/subcategory/get';
const endpoint2='/subcategory/register';
const endpoint3='/subcategory/update';

export const SubcategoryService = {

    getSubcategories: async () =>{
        try{
            const response = await axios.get(
                API_BASE_URL + endpoint1
            );

            return response.data;
        }catch(error:any){
            console.error('Error obteniendo subcategorias', error);
            throw new Error(error.response?.data?.message || 'Error al obtener subcategorías');
        }
    },

    registerSubcategory: async (subcategoryData:{
        cod_cat: number;
        nom_subcat_prod: string;
        descr_subcat_prod: string;
        imagen_representativa: File | Blob; 
    }) => {
        try{
            const formData = new FormData();
            formData.append('cod_cat', subcategoryData.cod_cat.toString());
            formData.append('nom_subcat_prod', subcategoryData.nom_subcat_prod);
            formData.append('descr_subcat_prod', subcategoryData.descr_subcat_prod);
            formData.append('imagen_repr', subcategoryData.imagen_representativa);

            const response = await axios.post(
                API_BASE_URL + endpoint2,
                formData,
                {
                    headers: {
                    'Content-Type': 'multipart/form-data'  
                    }
                }
            );

            return  response.data;
        }catch(error:any){
            console.error('Error registrando subcategoria:', error);
            throw new Error(error.response?.data?.error || 'Error al registrar sbcategoría');
        }
    },

    updateSubcategory: async (cod_subcat_prod: number, attributes: {
        cod_cat?: number;
        nom_subcat_prod?: string;
        descr_subcat_prod?: string;
        imagen_representativa?: File | Blob;
    }) => {
        try {
            const formData = new FormData();
            
            if (attributes.nom_subcat_prod) formData.append('nom_subcat_prod', attributes.nom_subcat_prod);
            if(attributes.cod_cat) formData.append('cod_cat', attributes.cod_cat.toString());
            if (attributes.descr_subcat_prod) formData.append('descr_subcat_prod', attributes.descr_subcat_prod);
            if (attributes.imagen_representativa) formData.append('imagen_representativa', attributes.imagen_representativa);
            const response = await axios.put(
                `${API_BASE_URL}/subcategory/update?cod_subcat_prod=${cod_subcat_prod}`,
                formData,
                {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                }
            );

            return response.data;
        }catch (error: any) {
            console.error('Error actualizando subcategoria:', error);
            throw new Error(error.response?.data?.message || 'Error al actualizar subcategoría');
        }
    }
}
   
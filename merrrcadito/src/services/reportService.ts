import axios from 'axios'

const API_BASE_URL=process.env.NEXT_PUBLIC_BACK_URL 

export const ReportService = {
    get_category_report_by_month: async(month : string) => {
        try{
            const response = await axios.get(
                `${API_BASE_URL}/categories/report_category_product_by_month`,
                {
                    params:{month}
                }
            );
            console.log("Primer reporte: ", response.data)
            return response.data;
        }catch(error){
            console.log("Error al obtener primer reporte");
        }
    }
}
import { GenericInput } from "@/Components/Atoms";
import { FormField } from "@/Components/Molecules";
import { useState } from "react";


export default function FormServiceProduct() {
    const [form, setForm] = useState({
        nom_serv: "",
        desc_serv: "",
        precio_serv: "",
        duracion: "",
        hrs_ini_dia_serv: "",
        hrs_fin_dia_serv: ""
    });

    const [error, setError] = useState();
    return (
        <div>
            <form>
                <div>
                    <FormField
                        htmlFor={form.nom_serv}
                        label="Nombre"
                        error={error as string | undefined}
                    >
                        <GenericInput
                            name="nom_serv"
                            value={form.nom_serv}
                            onChange={(e) => setForm({ ...form, nom_serv: e.target.value })}
                        />
                    </FormField>
                </div>
            </form>
        </div>
    );
}
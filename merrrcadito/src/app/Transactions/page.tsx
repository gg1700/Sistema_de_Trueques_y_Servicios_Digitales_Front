'use client'
import ProtectedLayout from "@/app/ProtectedLayout";
import { TransactionCard } from "@/Components/Molecules";
import { useUser } from "@/Contexts/userContext";
import { ReportService } from "@/services";
import { useEffect, useState } from "react";

export default function Transactions(){
    const [dataTrans, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user: userContext } = useUser();

    useEffect(() => {
      
        if (!userContext || !userContext.cod_us) {
            setLoading(false);
            return;
        }

        const codUs = userContext.cod_us;

        async function getTransactions(){
            try {
                setLoading(true);
                
                const response = await ReportService.get_user_transaction_history(codUs);
                const trans = response.data;
                const mapTrans = trans.map((tra : any) => ({
                    codTrans: tra.cod_trans,
                    cod_us_ori: tra.cod_us_origen,
                    cod_us_des: tra.cod_us_destino,
                    monto: tra.monto_pagado,
                    descripcion: tra.desc_trans,
                    fecha: tra.fecha_trans,
                    monedaTrans: tra.moneda,
                    handlename: tra.handle_name_origin,
                    codPub: tra.cod_pub,
                    token: tra.id_token
                }));
                setData(mapTrans);
            } catch (error) {
                console.error('Error al cargar transacciones:', error);
            } finally {
                setLoading(false);
            }
        }
        getTransactions();
    }, [userContext]); 

    if (loading) {
        return (
            <ProtectedLayout pageTitle="Tus Transacciones" pageSubtitle="Registradas">
                <div>Cargando...</div>
            </ProtectedLayout>
        );
    }

    if (!userContext || !userContext.cod_us) {
        return (
            <ProtectedLayout pageTitle="Tus Transacciones" pageSubtitle="Registradas">
                <div>Debes iniciar sesión para ver tus transacciones</div>
            </ProtectedLayout>
        );
    }

    return(
        <ProtectedLayout pageTitle="Tus Transacciones" pageSubtitle="Registradas">
            <div>
                {dataTrans.length === 0 ? (
                    <p>No tienes transacciones registradas</p>
                ) : (
                    dataTrans.map((tran : any) => (
                        <TransactionCard 
                            key={tran.codTrans}
                            cod_trans={tran.codTrans}
                            cod_us_origen={tran.cod_us_ori}
                            cod_us_destino={tran.cod_us_des}
                            monto_total={tran.monto}
                            moneda_trans={tran.monedaTrans}
                            cod_pub={tran.codPub}
                            id_token={tran.token}
                            fecha_trans={tran.fecha}
                            handlename_ori_dest={tran.handlename}
                            descr_trans={tran.descripcion}
                            cod_us={userContext.cod_us}
                        />
                    ))
                )}
            </div>
        </ProtectedLayout>
    );
}
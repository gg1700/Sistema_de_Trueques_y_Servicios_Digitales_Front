'use client'
import { TransactionCard } from "@/Components/Molecules";
import { AppLayout } from "@/Components/Templates";
import { ReportService } from "@/services";
import { useEffect, useState } from "react";


export default function Transactions(codUs: number) {
    const [dataTrans, setData] = useState([]);
    useEffect(() => {
        async function getTransactions() {
            const response = await ReportService.get_user_transaction_history(18);
            const trans = response.data;
            const mapTrans = trans.map((tra: any) => ({
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
            }))
            setData(mapTrans);
        }
        getTransactions();
    }, []);
    return (
        <AppLayout pageTitle="Transacciones" pageSubtitle="Registradas">
            <div>
                {dataTrans.map((tran: any) => (
                    <TransactionCard
                        key={tran.codTrans}
                        cod_trans={tran.codTrans}
                        cod_us_origen={tran.cod_us_ori}
                        cod_us_destino={tran.cod_us_des}
                        monto_total={tran.monto}
                        moneda_trans={tran.monedaTrans}
                        cod_pub={tran.cod_pub}
                        id_token={tran.token}
                        fecha_trans={tran.fecha}
                        handlename_ori_dest={tran.handlename}
                        descr_trans={tran.descripcion}
                        cod_us={18}
                    />
                ))}
            </div>
        </AppLayout>
    );
}

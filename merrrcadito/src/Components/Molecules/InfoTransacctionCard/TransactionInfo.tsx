interface TransactionInfoProps {
    precio_pub: number,
    handlename?: string,
    type?: string
}

export default function TransactionInfo({
    precio_pub,
    handlename,
    type = "transacción"
}: TransactionInfoProps){
    return(
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex flex-col">
                {handlename && (
                    <span className="text-base font-medium text-gray-900">
                        {handlename}
                    </span>
                )}
                <span className="text-sm text-gray-500">
                    {type}
                </span>
            </div>
            <div className="text-right">
                <span className="text-lg font-semibold text-gray-900">
                    ${precio_pub.toLocaleString('es-ES')}
                </span>
            </div>
        </div>
    );
}
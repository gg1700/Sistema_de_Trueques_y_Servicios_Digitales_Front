import TransactionInfo from "../InfoTransacctionCard/TransactionInfo";

interface TransactionCardProps {
    cod_trans: number,
    cod_us: number;
    cod_us_origen: number,
    cod_us_destino?: number | null,
    handlename_ori_dest: string,
    monto_total: number,
    cod_pub?: number | null,
    cod_poten?: number | null,
    cod_evento?: number | null, 
    descr_trans: string,
    moneda_trans: string,
    fecha_trans: string,
    id_token?: number
}

export default function TransactionCard({
    cod_trans,
    cod_us,
    cod_us_origen,
    cod_us_destino,
    handlename_ori_dest,
    monto_total,
    cod_pub,
    cod_poten,
    cod_evento,
    descr_trans,
    moneda_trans, 
    fecha_trans
}: TransactionCardProps) {

    const getVariant = () => {
        if (!cod_us_destino) {
         return 'Compra';
        }
     return cod_us === cod_us_origen ? 'Venta' : 'Compra';
    }

    const getVariantColor = () => {
        switch (cod_us) {
            case cod_us_origen: return 'bg-red-100 text-red-800 border-red-200';
            case cod_us_destino: return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getVariantIcon = () => {
        switch (cod_us) {
            case cod_us_origen: return '⬆️';
            case cod_us_destino: return '⬇️';
            default: return '⚡';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount: number, currency: string) => {
        const formattedAmount = amount.toLocaleString('es-ES');
    
            switch(currency) {
                case 'Bs':
                    return `Bs ${formattedAmount}`;
                case 'CV':
                    return `CV ${formattedAmount}`;
                case 'USD':
                    return `$${formattedAmount}`;
                default:
                    return `$${formattedAmount}`;
            }
        };
    

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getVariantColor()}`}>
                        <span className="text-lg">{getVariantIcon()}</span>
                        {getVariant()}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        #{cod_trans.toString().padStart(6, '0')}
                    </span>
                </div>
                <span className="text-sm text-gray-500 font-medium">
                    {formatDate(fecha_trans)}
                </span>
            </div>

            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {descr_trans}
                </h3>
            </div>

            
            <div className="space-y-3 mb-4">
                {cod_pub && (
                    <TransactionInfo 
                        precio_pub={monto_total}
                        handlename={handlename_ori_dest}
                        type="publicación"
                    />
                )}
                {cod_poten && (
                    <TransactionInfo 
                        precio_pub={monto_total}
                        handlename="Mi tiendita"
                        type="potencial"
                    />
                )}
                {cod_evento && (
                    <TransactionInfo
                        precio_pub={monto_total}
                        type="evento"
                    />
                )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 font-medium">Total:</span>
                    <span className="text-2xl font-bold text-gray-900">
                        {formatCurrency(monto_total, moneda_trans)}
                    </span>
                </div>
                
                <div className="text-right">
                    <span className="text-xs text-gray-500 block">
                        {cod_us === cod_us_origen ? 'Para:' : 'De:'}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                        {handlename_ori_dest}
                    </span>
                </div>
            </div>
        </div>
    );
}
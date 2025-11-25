// Servicio para manejar las operaciones de billetera

const WALLET_API_BASE =
    process.env.NEXT_PUBLIC_WALLET_API_BASE_URL ??
    "http://localhost:5000/api/wallets";

export interface WalletData {
    cod_bill: number;
    cod_us: number;
    cuenta_bancaria: string;
    saldo_actual: number;
    saldo_real?: number;
    saldo_bolivianos?: number;
    fecha_ultima_transaccion?: string;
}

/**
 * Obtiene los datos de la billetera de un usuario
 */
export async function getWalletDataByUser(cod_us: number): Promise<WalletData | null> {
    try {
        const response = await fetch(
            `${WALLET_API_BASE}/get_wallet_data_by_user?cod_us=${cod_us}`
        );

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success && data.data && Array.isArray(data.data) && data.data.length > 0) {
            return data.data[0];
        }

        return null;
    } catch (error) {
        console.error("Error al obtener datos de billetera:", error);
        throw error;
    }
}

/**
 * Crea una nueva billetera para un usuario
 */
export async function createWallet(
    cod_us: number,
    cuenta_bancaria: string,
    saldo_actual: number
): Promise<{ success: boolean; message: string }> {
    try {
        const response = await fetch(
            `${WALLET_API_BASE}/create_wallet?cod_us=${cod_us}&cuenta_bancaria=${cuenta_bancaria}&saldo_actual=${saldo_actual}`,
            { method: "GET" }
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al crear billetera:", error);
        return {
            success: false,
            message: (error as Error).message
        };
    }
}

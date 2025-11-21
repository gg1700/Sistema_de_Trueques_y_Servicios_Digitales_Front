import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface PurchaseTokensRequest {
    cod_us_origen: number;
    id_token: number;
    descr_trans?: string;
}

export interface TransactionResponse {
    success: boolean;
    message: string;
    error?: string;
}

/**
 * Purchase a token package for a user
 * @param cod_us_origen - User ID making the purchase
 * @param id_token - Token package ID to purchase
 * @param descr_trans - Optional transaction description
 * @returns Transaction response with success status and message
 */
export const purchaseTokens = async (
    cod_us_origen: number,
    id_token: number,
    descr_trans: string = 'Compra de paquete de tokens'
): Promise<TransactionResponse> => {
    try {
        const response = await axios.post(
            `${API_URL}/transactions/register?cod_us_origen=${cod_us_origen}`,
            {
                id_token: id_token.toString(),
                descr_trans,
                moneda: 'Bs',
                cod_potenciador: null,
                cod_pub: null,
                cod_evento: null,
                monto_regalo: null
            }
        );
        return response.data;
    } catch (error: any) {
        console.error('Error purchasing tokens:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Error al procesar la compra',
            error: error.response?.data?.error || error.message
        };
    }
};

/**
 * Get transaction history for a user
 * @param cod_us - User ID
 * @returns Array of transactions
 */
export const getUserTransactionHistory = async (cod_us: number) => {
    try {
        const response = await axios.get(
            `${API_URL}/transactions/get_user_transaction_history?cod_us=${cod_us}`
        );
        return response.data;
    } catch (error: any) {
        console.error('Error fetching transaction history:', error);
        throw error;
    }
};

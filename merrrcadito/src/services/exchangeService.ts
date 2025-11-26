// Exchange Service
const API_BASE = process.env.NEXT_PUBLIC_EXCHANGES_API_BASE_URL || 'http://localhost:5000/api/exchanges';

export const exchangeService = {
    async acceptExchange(exchangeId: number, userId: number) {
        const response = await fetch(`${API_BASE}/${exchangeId}/accept`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
        });
        if (!response.ok) throw new Error('Failed to accept exchange');
        return response.json();
    },

    async rejectExchange(exchangeId: number, userId: number, reason?: string) {
        const response = await fetch(`${API_BASE}/${exchangeId}/reject`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, reason }),
        });
        if (!response.ok) throw new Error('Failed to reject exchange');
        return response.json();
    },

    async confirmExchange(exchangeId: number, userId: number) {
        const response = await fetch(`${API_BASE}/${exchangeId}/confirm`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
        });
        if (!response.ok) throw new Error('Failed to confirm exchange');
        return response.json();
    },

    async getExchangesByStatus(userId: number, status: string) {
        const response = await fetch(`${API_BASE}/user/${userId}/status/${status}`);
        if (!response.ok) throw new Error('Failed to fetch exchanges by status');
        return response.json();
    },

    async getUserExchanges(userId: number) {
        const response = await fetch(`${API_BASE}/user/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user exchanges');
        return response.json();
    },

    async getExchangeDetails(exchangeId: number) {
        const response = await fetch(`${API_BASE}/${exchangeId}`);
        if (!response.ok) throw new Error('Failed to fetch exchange details');
        return response.json();
    },
};

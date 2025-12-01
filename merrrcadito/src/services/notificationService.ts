// Notification Service
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const API_BASE = `${API_BASE_URL}/notifications`;

export const notificationService = {
    async getNotifications(userId: number, unreadOnly: boolean = false) {
        try {
            const url = `${API_BASE}/${userId}${unreadOnly ? '?unreadOnly=true' : ''}`;
            console.log('🔔 Calling notification API:', url); // DEBUG
            const response = await fetch(url);
            if (!response.ok) {
                console.error('Notification API error:', response.status, response.statusText);
                console.error('Failed URL:', url); // DEBUG
                return { success: false, data: [] }; // Return empty instead of throwing
            }
            return response.json();
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            return { success: false, data: [] }; // Return empty instead of throwing
        }
    },

    async getUnreadCount(userId: number) {
        const response = await fetch(`${API_BASE}/${userId}/unread-count`);
        if (!response.ok) throw new Error('Failed to fetch unread count');
        return response.json();
    },

    async markAsRead(notificationId: number) {
        const response = await fetch(`${API_BASE}/${notificationId}/read`, {
            method: 'PUT',
        });
        if (!response.ok) throw new Error('Failed to mark as read');
        return response.json();
    },

    async markAllAsRead(userId: number) {
        const response = await fetch(`${API_BASE}/${userId}/read-all`, {
            method: 'PUT',
        });
        if (!response.ok) throw new Error('Failed to mark all as read');
        return response.json();
    },

    async deleteNotification(notificationId: number) {
        const response = await fetch(`${API_BASE}/${notificationId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete notification');
        return response.json();
    },
};

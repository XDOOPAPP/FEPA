import apiClient from '../apiClient';
import { API_CONFIG } from '../../config/api.config';

export const notificationAPI = {
    /**
     * Get all notifications
     * GET /notifications
     */
    getAll: async () => {
        return await apiClient.get(API_CONFIG.NOTIFICATIONS.LIST);
    },

    /**
     * Mark a notification as read
     * PATCH /notifications/:id/read
     */
    markAsRead: async (id: string) => {
        return await apiClient.patch(API_CONFIG.NOTIFICATIONS.MARK_READ(id));
    },

    /**
     * Mark all notifications as read
     * PATCH /notifications/read-all
     */
    markAllAsRead: async () => {
        return await apiClient.patch(API_CONFIG.NOTIFICATIONS.MARK_ALL_READ);
    },

    /**
     * Delete a notification
     * DELETE /notifications/:id
     */
    delete: async (id: string) => {
        return await apiClient.delete(API_CONFIG.NOTIFICATIONS.DELETE(id));
    }
};

export default notificationAPI;

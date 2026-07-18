/** GET /api/notifications 응답 항목 */
export interface AppNotification {
  notificationId: number;
  notificationType: string;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

/**
 * NotificationList Component
 * Displays a list of notifications
 */

import Notification from './Notification';

export default function NotificationList({ notifications, onMarkAsRead, onMarkAllAsRead }) {
  if (!notifications || notifications.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No notifications</p>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div>
      {unreadCount > 0 && onMarkAllAsRead && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={onMarkAllAsRead}
            className="text-sm text-primary-600 hover:text-primary-700 underline"
          >
            Mark all as read
          </button>
        </div>
      )}
      <div className="space-y-2">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            notification={notification}
            onMarkAsRead={onMarkAsRead}
          />
        ))}
      </div>
    </div>
  );
}




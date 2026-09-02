import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { markAsRead, removeNotification, markAllAsRead } from '../../store/slices/notificationSlice';

function NotificationPanel({ onClose }) {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notifications);

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
  };

  const handleRemove = (id) => {
    dispatch(removeNotification(id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'review_request':
        return '📋';
      case 'review_completed':
        return '✅';
      case 'payment':
        return '💰';
      case 'message':
        return '💬';
      case 'alert':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'review_request':
        return 'bg-blue-50 border-blue-200';
      case 'review_completed':
        return 'bg-green-50 border-green-200';
      case 'payment':
        return 'bg-purple-50 border-purple-200';
      case 'alert':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
        {notifications.length > 0 && (
          <button
            onClick={() => dispatch(markAllAsRead())}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-sm">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-2 p-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border cursor-pointer transition ${
                  notification.isRead
                    ? 'bg-white border-gray-200'
                    : getNotificationColor(notification.type)
                } hover:shadow-md`}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span className="text-lg mt-1 flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(notification.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(notification.id);
                    }}
                    className="p-1 rounded hover:bg-gray-200 text-gray-500 flex-shrink-0"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 text-center">
          <button
            onClick={onClose}
            className="text-sm text-gray-600 hover:text-gray-900 font-medium"
          >
            Close Notifications
          </button>
        </div>
      )}
    </div>
  );
}

export default NotificationPanel;

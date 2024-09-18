// utils/notificationUtils.js

import { showNotification } from "../../screens/main/Notification";
import { Notifications, postNotificationsStatus } from "../../services/notificationService";

 

export const fetchNotifications = async (page = 1, shownNotificationIds = new Set(), setNotifications, setHasMore, setShownNotificationIds) => {
  try {
    const data = await Notifications(page, 10);
    if (data.status && data.status.type === 'success') {
      const newNotifications = data.data.items;
       const uniqueNotifications = [];
      const seenIds = new Set();
      newNotifications.forEach(notification => {
        if (!seenIds.has(notification.id)) {
          seenIds.add(notification.id);
          uniqueNotifications.push(notification);
        }
      });
       const filteredNotifications = uniqueNotifications.filter(
        notification => !shownNotificationIds.has(notification.id),
      );

      const newShownIds = new Set(shownNotificationIds);
      filteredNotifications.forEach(notification =>
        newShownIds.add(notification.id),
      );
      setShownNotificationIds(newShownIds);

      setNotifications(prevNotifications => [
        ...prevNotifications,
        ...filteredNotifications,
      ]);

      filteredNotifications.forEach(notification => {
        if (!notification.isRead) {
          showNotification(
            notification.title || 'New Notification',
            notification.message,
          );
        }
      });
      setHasMore(newNotifications.length > 0);
    } else {
      console.error('Error fetching notifications:', data.status.message);
    }
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
};

export const markAsRead = async (notificationId, setNotifications) => {
  try {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId ? { ...notification, isRead: true } : notification
      )
    );
    await postNotificationsStatus({ id: notificationId, isRead: true });
  } catch (error) {
    console.error('Error marking notification as read:', error.message || 'Unknown Error');
  }
};

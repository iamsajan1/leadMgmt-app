import React, { useEffect } from 'react';
import { AppState } from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';
import PushNotification from 'react-native-push-notification';
import { useNavigation } from '@react-navigation/native';
import { Notifications } from '../services/notificationService';

const BackgroundTask = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Configure push notification
    PushNotification.configure({
      onRegister: function (token) {
        console.log('[PushNotification] TOKEN:', token);
      },
      onNotification: function (notification) {
        console.log('[PushNotification] NOTIFICATION:', notification);
        // Optional: Handle notification interaction (e.g., navigating to a specific screen)
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });

    // Configure background task
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 0.3, // Minimum interval in minutes
        stopOnTerminate: false, // Continue background task even if app is terminated
        startOnBoot: true, // Start background task when device boots up
        enableHeadless: true, // Allow background tasks to run when the app is closed
      },
      async (taskId) => {
        console.log('[BackgroundFetch] Task started:', taskId);

        try {
          // Fetch unread notifications from your API
          const notifications = await Notifications(1, 10); // Fetch the first page with 10 notifications
          console.log('[BackgroundFetch] Notifications fetched:', notifications);

          // Check if there are any unread notifications
          const unreadNotifications = notifications.filter(notification => !notification.read);
          console.log('[BackgroundFetch] Unread Notifications:', unreadNotifications.length);

          if (unreadNotifications.length > 0) {
            // Send a local notification
            PushNotification.localNotification({
              title: "New Notifications",
              message: `You have ${unreadNotifications.length} new unread notifications.`,
              playSound: true,
              soundName: 'default', // Ensure a sound is played
            });
            console.log('[BackgroundFetch] Local notification sent.');

            // Optionally, mark them as read using your API
            for (const notification of unreadNotifications) {
              const response = await postNotificationsStatus({ id: notification.id });
              console.log('[BackgroundFetch] Notification marked as read:', notification.id, response);
            }

            // Optionally navigate to a screen if the app is in the foreground
            if (AppState.currentState === 'active') {
              console.log('[BackgroundFetch] App is in foreground, navigating to leadslist.');
              navigation.navigate('leadslist'); // Replace with your specific screen
            }
          } else {
            console.log('[BackgroundFetch] No new unread notifications.');
          }
        } catch (error) {
          console.error('[BackgroundFetch] Error fetching notifications:', error);
        }

        // Finish background task
        BackgroundFetch.finish(taskId);
        console.log('[BackgroundFetch] Task finished:', taskId);
      },
      (error) => {
        console.error('[BackgroundFetch] Configuration error:', error);
      }
    );

    // Start background task
    BackgroundFetch.start();
    console.log('[BackgroundFetch] Started.');

    return () => {
      // Stop background task when component unmounts
      BackgroundFetch.stop();
      console.log('[BackgroundFetch] Stopped.');
    };
  }, [navigation]);

  useEffect(() => {
    // Handle app state changes
    const handleAppStateChange = (nextAppState) => {
      console.log('[AppState] App state changed:', nextAppState);
      if (nextAppState === 'active') {
        // If app is brought to foreground, restart background task
        BackgroundFetch.start();
        console.log('[BackgroundFetch] Restarted after app state change.');
      }
    };

    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
      console.log('[AppState] Event listener removed.');
    };
  }, []);

  return null; // This component doesn't render anything
};

export default BackgroundTask;

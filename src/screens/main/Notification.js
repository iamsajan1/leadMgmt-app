import PushNotification from 'react-native-push-notification';

const createChannel = () => {
  const channelId = 'Test_Channel'; 
  const channelName = 'TestChannel'; 
  const channelDescription = 'addmission pannel'; 

  PushNotification.createChannel(
    {
      channelId,
      channelName,
      channelDescription,
      playSound: true,
      soundName: 'default',
    },
    created => console.log(`createChannel returned '${created}'`)
  );

  return channelId;
};

const showNotification = (title, message) => {
  const channelId = createChannel();
  PushNotification.localNotification({
    title,
    message,
    channelId,
  });
};

const handleScheduledNotification = (title, message) => {
  const channelId = createChannel(); 
  PushNotification.localNotificationSchedule({
    title,
    message,
    date: new Date(Date.now() + 5 * 1000),
    channelId,
  });
};

const handleCancel = () => {
  PushNotification.cancelAllLocalNotifications();
};

export { showNotification, handleScheduledNotification, handleCancel };

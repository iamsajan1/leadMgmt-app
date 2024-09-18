import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthProvider';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import PushNotification from 'react-native-push-notification';
import { PermissionsAndroid, Platform, StyleSheet, View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import NetInfo from '@react-native-community/netinfo';
import { Banner, PaperProvider, useTheme } from 'react-native-paper';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import SplashScreen from './src/screens/main/SplashScreen';
 const App = () => {
  const [appLoading, setAppLoading] = useState(true);
  const [colorScheme, setColorScheme] = useState('light');
  const [isConnected, setIsConnected] = useState(true);

  const theme = useTheme();

  const checkNetworkConnection = useCallback(() => {
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
    });

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      // console.log('Network is connected:', state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const createChannel = () => {
    PushNotification.createChannel({
      channelId: 'test-channel',
      channelName: 'Test Channel',
    });
  };

  const requestCallLogPermission = async () => {
    try {
      const readCallLogPermission = PermissionsAndroid.PERMISSIONS.READ_CALL_LOG;
      const writeCallLogPermission = PermissionsAndroid.PERMISSIONS.WRITE_CALL_LOG;
      const phoneCallPermission = PermissionsAndroid.PERMISSIONS.CALL_PHONE;
      const readPhoneStatePermission = PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE;
      
      // Check for Android 13+ before requesting POST_NOTIFICATIONS
      let postNotificationPermissionGranted = PermissionsAndroid.RESULTS.GRANTED;
      if (Platform.Version >= 33) {
        const postNotificationPermission = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;
        postNotificationPermissionGranted = await PermissionsAndroid.request(
          postNotificationPermission
        );
      }
  
      const phoneCallPermissionGranted = await PermissionsAndroid.request(phoneCallPermission);
      const readContactPermissionGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS
      );
      const writeContactPermissionGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS
      );
      const readPermissionGranted = await PermissionsAndroid.request(readCallLogPermission);
      const writePermissionGranted = await PermissionsAndroid.request(writeCallLogPermission);
      const readPhoneStatePermissionGranted = await PermissionsAndroid.request(readPhoneStatePermission);
  
      if (
        readPermissionGranted === PermissionsAndroid.RESULTS.GRANTED &&
        writePermissionGranted === PermissionsAndroid.RESULTS.GRANTED &&
        readContactPermissionGranted === PermissionsAndroid.RESULTS.GRANTED &&
        writeContactPermissionGranted === PermissionsAndroid.RESULTS.GRANTED &&
        phoneCallPermissionGranted === PermissionsAndroid.RESULTS.GRANTED &&
        readPhoneStatePermissionGranted === PermissionsAndroid.RESULTS.GRANTED &&
        postNotificationPermissionGranted === PermissionsAndroid.RESULTS.GRANTED // Check this only if Android 13+
      ) {
        console.log('All Permissions Granted');
      } else {
        console.log('All Permissions Not Granted');
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

  const toggleColorScheme = () => {
    const newColorScheme = colorScheme === 'light' ? 'dark' : 'light';
    setColorScheme(newColorScheme);
  };

  const triggerLocalNotification = () => {
    PushNotification.localNotification({
      channelId: 'test-channel',
      title: 'My Notification Title',
      message: 'My Notification Message',
    });
  };

  const paperTheme =
    theme && theme.colors && theme.colors.light
      ? { ...MD3DarkTheme, colors: theme.colors.light }
      : colorScheme === 'dark'
      ? { ...MD3DarkTheme }
      : { ...MD3LightTheme };

  useEffect(() => {
    const initializeApp = async () => {
      if (!isConnected) {
        // Handle no internet connection, show Banner instead of Alert
        // Optionally, you can add a retry action to the Banner
      }

      // Simulate an API call or any other initialization process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Once initialization is done, set appLoading to false
      setAppLoading(false);

      // Initialize PushNotification, create channel, request permission, etc.
      createChannel();
      requestCallLogPermission(); // Request all necessary permissions
    };

    checkNetworkConnection(); // Initial network check
    initializeApp(); // Initialize app after the initial network check
  }, [checkNetworkConnection, isConnected]); // Depend on checkNetworkConnection and isConnected

  return (
    <AuthProvider>
      <PaperProvider theme={paperTheme}>
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.colors.background }}>
          <SafeAreaProvider style={{ flex: 1, backgroundColor: theme.colors.background }}>
            {appLoading ? (
              <SplashScreen navigation={undefined} />
            ) : (
              <NavigationContainer>
                {!isConnected && (
                  <Banner
                    visible={!isConnected}
                    actions={[
                      {
                        label: 'Retry',
                        onPress: () => checkNetworkConnection(),
                      },
                    ]}
                  >
                    No Internet Connection
                  </Banner>
                )}
                <AppNavigator changeTheme={toggleColorScheme} />
              </NavigationContainer>
            )}
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </PaperProvider>
    </AuthProvider>
  );
};

export default App;

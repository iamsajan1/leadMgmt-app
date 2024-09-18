import React, { useState, useEffect } from 'react';
import { Image, Alert, Linking, TouchableOpacity, Text } from 'react-native';

const BannerAlert = () => {
  const [visible, setVisible] = useState(true);

  const handleOpenSettings = () => {
    setVisible(false);
    // Use Linking to open the data connection settings
    Linking.openSettings();
  };

  useEffect(() => {
    if (visible) {
      // Display an alert when the banner is visible
      Alert.alert(
        'Connection Lost',
        'Please fix the connection issue.',
        [
          {
            text: 'Fix it',
            onPress: () => setVisible(false),
          },
          {
            text: 'Learn more',
            onPress: () => setVisible(false),
          },
          {
            text: 'Open Settings',
            onPress: handleOpenSettings,
          },
        ],
        { cancelable: false }
      );
    }
  }, [visible]);

  return null;
};

export default BannerAlert;

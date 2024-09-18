import React, { useState } from 'react';
import { Image } from 'react-native';
import { Banner, Icon } from 'react-native-paper';

const CustomBanner = () => {
  const [visible, setVisible] = useState(true);

  return (
    <Banner
      visible={visible}
      actions={[
        {
          label: 'Fix it',
          onPress: () => setVisible(false),
        },
        {
          label: 'Learn more',
          onPress: () => setVisible(false),
        },
      ]}
      icon={'shield-alert-outline'}
      >
      There was a problem processing a transaction on your credit card.
    </Banner>
  );
};

export default CustomBanner;
import React from 'react';
import {Chip} from 'react-native-paper';

const ChipTag = () => {
  return (
    <Chip icon="information" onPress={() => console.log('Pressed')}>
      Example Chip
    </Chip>
  );
};

export default ChipTag;

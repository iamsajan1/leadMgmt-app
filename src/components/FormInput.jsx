import { React, useState } from 'react';
import { TextInput } from 'react-native-paper';

const MyComponent = (props) => {
  return (
    <TextInput
      label={props.label}
      value={props.text}
      onChangeText={text => props.setText(text)}
    />
  );
};

export default MyComponent;
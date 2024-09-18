import React from 'react';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';

const Loading = () => {
  return (
    <ActivityIndicator animating={true} color={MD2Colors.red800} />
  )
}

export default Loading
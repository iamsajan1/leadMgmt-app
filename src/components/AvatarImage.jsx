import React from 'react';
import { Avatar } from 'react-native-paper';

const AvatarImage = () => {
  return (
    <Avatar.Image size={24} source={require('../assets/avatar.png')} />
  )
}

export default AvatarImage
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-paper';

const HeaderWithBackButton = ({ headerText }) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBackPress}>
        <Icon source="keyboard-backspace" color="#075e54" size={30} />
      </TouchableOpacity>
      <Text style={styles.headerText}>{headerText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginLeft: 6,
  },
  headerText: {
    color: '#565656',
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 9,
  },
});

export default HeaderWithBackButton;

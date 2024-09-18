import React from 'react';
import { View, StyleSheet } from 'react-native';
import CallDetailsComponent from './CallDetailsComponent';

const CallDetails = ({ route }) => {
  return (
    <View style={styles.container}>
      <CallDetailsComponent route={route} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
    padding: 2,
  },
});

export default CallDetails;

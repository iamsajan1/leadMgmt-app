import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Linking, TouchableOpacity } from 'react-native';
import { Avatar, Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import CallLogs from 'react-native-call-log';
import HeaderWithBackButton from './HeaderWithBackButton';

const CallDetailsComponent = ({ route }) => {
  const phoneNumber = route.params?.phoneNumber;
  const [callHistory, setCallHistory] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    if (phoneNumber) {
      CallLogs.loadAll().then((callLogs) => {
        const filteredLogs = callLogs.filter((log) => log.phoneNumber === phoneNumber);
        setCallHistory(filteredLogs);
      });
    }
  }, [phoneNumber]);

  const displayName = callHistory.length > 0 ? callHistory[0].name : 'No Name';

  const handleWhatsAppPress = () => {
    const whatsappNumber = phoneNumber.replace(/\D/g, ''); 
    const whatsappMessage = 'Hello, I am reaching out from your app!';
    const whatsappURL = `whatsapp://send?phone=${whatsappNumber}&text=${whatsappMessage}`;

    Linking.canOpenURL(whatsappURL).then((supported) => {
      if (supported) {
        return Linking.openURL(whatsappURL);
      } else {
    
      }
    });
  };

  const handleCallPress = () => {
    const phoneURL = `tel:${phoneNumber}`;
    Linking.canOpenURL(phoneURL).then((supported) => {
      if (supported) {
        return Linking.openURL(phoneURL);
      } else {
        // console.log('Phone call is not supported on the device');
      }
    });
  };

  const handleTextMessagePress = () => {
    // Handle text messaging functionality here
    // console.log('Text message pressed for:', phoneNumber);
  };

  return (
    <View style={styles.container}>
     <HeaderWithBackButton headerText="Call Details" />

      <Avatar.Image style={styles.AvatarImage} size={55} source={require('../assets/images/th.jpg')} />
      <Text style={styles.title}>{displayName}</Text>
      <View style={styles.iconContainer}>
        <Icon
          source="phone"
          size={30}
          color="#055df5"
          onPress={handleCallPress}
          style={styles.icon}
        />
        <Icon
          source="whatsapp"
          size={30}
          color="#25D366"
          onPress={handleWhatsAppPress}
          style={styles.icon}
        />
        <Icon
          source="message-text"
          size={30}
          color="#075E54"
          onPress={handleTextMessagePress}
          style={styles.icon}
        />
      </View>
      <FlatList
        data={callHistory}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.callLogItem}>
            <Text style={styles.logText}>{item.duration} Sec</Text>
            <Text style={styles.logText}>{item.dateTime}</Text>
            <Text style={styles.logText}>{item.type}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
    padding: 2,
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#636363',
    marginLeft: 7,
    justifyContent: 'center',
  },
  callLogItem: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginVertical: 2,
    elevation: 1,
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
  },
  logText: {
    fontSize: 13,
    color: 'black',
  },
  AvatarImage: {
    alignSelf: 'center',
    marginTop: 30,
  },
  Header: {
    color: '#565656',
    fontSize: 20,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
    marginBottom: 8,
  },
  icon: {
    alignSelf: 'center',
  },
});

export default CallDetailsComponent;

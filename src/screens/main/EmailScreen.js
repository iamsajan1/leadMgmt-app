// EmailDashboard.js
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme, Searchbar, Avatar, FAB, Icon } from 'react-native-paper';
import { Swipeable } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const { Navigator, Screen } = createMaterialTopTabNavigator();

const EmailItem = ({ item, onArchive, onDelete, onMarkAsRead }) => {
  const renderRightActions = () => {
    return (
      <View style={styles.rightActionsContainer}>
        <TouchableOpacity onPress={onArchive} style={styles.actionButton}>
          <Icon source={'delete'} color='red' size={25} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
          <Icon source={'delete'} color='red' size={25} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onMarkAsRead} style={styles.actionButton}>
          <Icon source={'delete'} color='red' size={25} />
        </TouchableOpacity>
      </View>
    );
  };
  const navigation = useNavigation();

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('EmailDetail', {
            subject: item.subject,
            sender: item.sender,
            content: item.content,
          });
        }}
        style={styles.emailContainer}
      >
        <Avatar.Text size={50} label={item.sender.slice(0, 2).toUpperCase()} />
        <View style={styles.emailContent}>
          <Text style={styles.emailSubject}>{item.subject}</Text>
          <Text style={styles.emailSender}>{item.sender}</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const EmailList = ({ data }) => {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <EmailItem
          item={item}
          onArchive={() => console.log('Archive', item.id)}
          onDelete={() => console.log('Delete', item.id)}
          onMarkAsRead={() => console.log('MarkAsRead', item.id)}
        />
      )}
    />
  );
};

const EmailDashboardTab = ({ route }) => {
  const { data } = route.params;
  return <EmailList data={data} />;
};

const ComposeEmailFAB = ({ onPress }) => {
  return (
    <FAB
      style={styles.fab}
      icon="plus"
      onPress={onPress}
      color="#fff"
    />
  );
};

const EmailDashboard = () => {
  const theme = useTheme();
  const [fabVisible, setFabVisible] = React.useState(true);

  const inboxData = [
    { id: '1', subject: 'Meeting Tomorrow', sender: 'john.doe@example.com', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...' },
    { id: '2', subject: 'React Native Workshop', sender: 'react.native@example.com', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...' },
    { id: '3', subject: 'Meeting Tomorrow', sender: 'john.doe@example.com', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...' },
    { id: '4', subject: 'React Native Workshop', sender: 'react.native@example.com', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...' },
    { id: '5', subject: 'Meeting Tomorrow', sender: 'john.doe@example.com', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...' },
    { id: '6', subject: 'React Native Workshop', sender: 'react.native@example.com', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...' },
    { id: '7', subject: 'Meeting Tomorrow', sender: 'john.doe@example.com', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...' },
    { id: '8', subject: 'React Native Workshop', sender: 'react.native@example.com', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...' },
    { id: '9', subject: 'Meeting Tomorrow', sender: 'john.doe@example.com', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...' },
    { id: '10', subject: 'React Native Workshop', sender: 'react.native@example.com', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...' },
    { id: '11', subject: 'Meeting Tomorrow', sender: 'john.doe@example.com', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...' },
    { id: '12', subject: 'React Native Workshop', sender: 'react.native@example.com', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...' },
    { id: '13', subject: 'Meeting Tomorrow', sender: 'john.doe@example.com', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...' },
    { id: '14', subject: 'React Native Workshop', sender: 'react.native@example.com', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...' },
    { id: '15', subject: 'Meeting Tomorrow', sender: 'john.doe@example.com', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...' },
    { id: '16', subject: 'React Native Workshop', sender: 'react.native@example.com', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...' },
    { id: '17', subject: 'Meeting Tomorrow', sender: 'john.doe@example.com', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...' },
    { id: '18', subject: 'React Native Workshop', sender: 'react.native@example.com', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...' },
    { id: '19', subject: 'Meeting Tomorrow', sender: 'john.doe@example.com', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...' },
    { id: '20', subject: 'React Native Workshop', sender: 'react.native@example.com', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...' },
    { id: '21', subject: 'Meeting Tomorrow', sender: 'john.doe@example.com', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...' },
    { id: '22', subject: 'React Native Workshop', sender: 'react.native@example.com', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...' },

  ];

  const sentData = [
    { id: '1', subject: 'Sent Meeting Confirmation', sender: 'john.doe@example.com', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...' },
    { id: '2', subject: 'Follow-up on Workshop', sender: 'react.native@example.com', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...' },
   ];

  return (
    <View style={styles.container}>
      <Searchbar style={styles.searchBar} placeholder='Search' />
      <Navigator
        screenOptions={{
          tabBarActiveTintColor: 'rgba(103, 80, 164, 1)',
          tabBarIndicatorStyle: {
            backgroundColor: 'blue',
          },
          tabBarStyle: {
            backgroundColor: '#FEFEFE',
          },
        }}
      >
        <Screen
          name="Inbox"
          component={EmailDashboardTab}
          initialParams={{ data: inboxData }}
        />
        <Screen
          name="Sent"
          component={EmailDashboardTab}
          initialParams={{ data: sentData }}
        />
      </Navigator>
      {fabVisible && <ComposeEmailFAB onPress={() => console.log('Compose email pressed')} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFEFE',
  },
  searchBar: {
    width: '95%',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 8,
    backgroundColor: '#FEFEFE',
    borderWidth: 1,
  },
  emailContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#555',
    alignItems: 'center',
  },
  emailContent: {
    marginLeft: 15,
  },
  emailSubject: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  emailSender: {
    color: '#777',
  },
  rightActionsContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  actionButton: {
    backgroundColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginRight: 5,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(103, 80, 164, 1)',
  },
});

export default EmailDashboard;

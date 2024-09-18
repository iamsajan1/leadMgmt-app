import { useNavigation } from '@react-navigation/native';
import React, { useContext,useState,useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { logout } from 'react-native-app-auth';
import { Avatar, Title, Caption, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icon from react-native-vector-icons
import { AuthContext } from '../context/AuthProvider';
import EncryptedStorage from 'react-native-encrypted-storage';


const DrawerItem = ({ icon, label, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.drawerItem}>
    <View style={styles.drawerItemContent}>
      <Icon name={icon} size={24} color="#333" style={styles.drawerItemIcon} />
      <Title style={styles.drawerItemText}>{label}</Title>
    </View>
  </TouchableOpacity>
);


const AppDrawer = () => {
  const [userData, setUserData] = useState()
  const checkAuthentication = async () => {
    try {
      const storedUser = await EncryptedStorage.getItem('user_session');
      console.log('Stored User Session:', storedUser); // Log stored user session
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        console.log('Parsed User Session Data:', userData); // Log parsed user session data
        console.log('User ID:', userData.firstName); // Log user's first name
        setUserData(userData); // Update userData state
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
    }
  };
  
  
  
  useEffect(() => {
    checkAuthentication()
  }, [])
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <View style={{marginLeft:0}}>
            <Avatar.Image style={{backgroundColor:'#fff',alignSelf:'center'}} size={64} source={require('../assets/images/useIcon.png')} />
            <View style={{alignSelf:'center'}}>
              <Title style={{alignSelf:'center'}}>{userData && userData.firstName}</Title>
              <Caption style={{fontSize:12,alignSelf:'center'}}>{userData && userData.emailAddress}</Caption>
            </View>
          </View>            
        </TouchableOpacity>
        <Divider />
      </View>

      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={styles.drawerSection}>
          <DrawerItem icon="inbox" label="Inbox" onPress={() => navigation.navigate('Inbox')} />
          <DrawerItem icon="star-outline" label="Starred" onPress={() => navigation.navigate('Starred')} />
          <DrawerItem icon="calendar-blank-outline" label="events" onPress={() => navigation.navigate('MyCalendar')} />
          <DrawerItem icon="plus-circle" label="Create Lead" onPress={() => navigation.navigate('CreateLeads')} />
          <DrawerItem icon="calendar-blank-multiple" label="Todo List" onPress={() => navigation.navigate('Todo')} />

          <DrawerItem icon="help-circle-outline" label="Help & Support" onPress={() => navigation.navigate('HelpSupport')} />
          <DrawerItem icon="decagram-outline" label="Settings" onPress={() => navigation.navigate('Settings')} />
          <DrawerItem icon="logout" label="Logout" onPress={logout} />
         </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  },
  header: {
    marginTop: 10,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  profileInfo: {
    marginLeft: 16,
  },
  title: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    color: '#555',
  },
  drawerSection: {
    marginVertical: 6,
    marginLeft:15
  },
  drawerItem: {
   padding:6 },
  drawerItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerItemIcon: {
    marginRight: 16,
  },
  drawerItemText: {
    fontSize: 16,
    color: '#333',
  },
  drawerSectionBottom:{
    marginVertical: 6,
    marginLeft:15.,
    alignContent:'flex-end',
    marginTop: 205,
  },
});

export default AppDrawer;

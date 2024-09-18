import React, { useEffect, useState } from 'react';
import {View, Image, StyleSheet, Dimensions} from 'react-native';
import {
  TouchableOpacity,
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler';
const {width, height} = Dimensions.get('window');
import {useNavigation} from '@react-navigation/native';
import {Divider, Text, Icon, Switch, List, useTheme, Avatar} from 'react-native-paper';
import EncryptedStorage from 'react-native-encrypted-storage';

const Settings = () => {
  const theme = useTheme();
  const user = {
    name: 'Vikas kumar',
    email: 'Vikas@gmail.com',
    profilePicture:
      'https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg',
  };
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  const [expanded, setExpanded] = React.useState(true);
  const handlePress = () => setExpanded(!expanded);
  const navigation = useNavigation();
  const [userData, setUserData] = useState()


  const GridItem = ({icon, color, label, onPress}) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.Grid}>
          <Icon source={icon} color={color} size={25} />
          <Text style={{color: theme.colors.secondary}}>{label}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    container: {
      justifyContent: 'flex-start',
      padding: 7,
      backgroundColor:"#f3f3f3"
    },
    profilePicture: {
    },
    detailsContainer: {
      color: theme.colors.secondary,
      padding: 4,
      alignSelf: 'center',
      marginBottom:7
    },
    AccordianMenu: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface, // Use theme color for surface
      padding: 0,
      borderBottomWidth: 0.2,
      marginBottom:2,
      marginTop:4,
      elevation:2
    },
    name: {
      fontSize: 20,
      fontWeight: 'bold',
      marginLeft: 15,
      marginTop: 8,
      color: theme.colors.secondary, // Use theme color for text
    },
    email: {
      fontSize: 14,
      color: theme.colors.secondary, // Use theme color for text
      marginLeft: 15,
    },
    profileContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignSelf: 'flex-start',
      marginLeft: 14,
    },
    MenuItem: {
      flexDirection: 'row',
      padding: 10,
      borderRadius: 5,
      marginBottom: 6,
      backgroundColor: theme.colors.surface, // Use theme color for surface
      elevation:2
    },
    MenuText: {
      fontSize: 15,
      marginLeft: 12,
      alignSelf: 'center',
      color: theme.colors.secondary, // Use theme color for text
    },
    GridContainer: {
      flexDirection: 'row',
      width: '105%',
      justifyContent:'space-evenly',
      marginBottom: 5,
      marginLeft:-8,
      paddingHorizontal:4

    },
    Grid: {
      width: 155,
      borderWidth: 0.3,
      borderRadius: 5,
      borderColor: theme.colors.onSurface,
      backgroundColor: theme.colors.surface,
      marginBottom: 3,
      alignSelf: 'flex-start',
      alignItems: 'center',
      paddingVertical: 8,
      padding:15,
      elevation:2
    },
    GridouterContainer: {
      justifyContent: 'flex-start',
      padding: 5,
      elevation:2
    },
  });


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
  return (
    <GestureHandlerRootView>
      <ScrollView>
        <View style={[styles.container, {height: height}]}>
          <View style={styles.profileContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Avatar.Image style={{backgroundColor:'white'}} size={60} source={require('../../assets/images/useIcon.png')} />
            </TouchableOpacity>
            <View style={styles.detailsContainer}>
              <Text style={styles.name}>{userData && userData.firstName}</Text>
              <Text style={styles.email}>{userData && userData.emailAddress}</Text>
            </View>
          </View>
          <View style={styles.GridouterContainer}>
            <View style={styles.GridContainer}>
              <GridItem 
                icon="calendar-blank-outline"
                color="#328f04"
                label="Events"
                onPress={() => {
                  navigation.navigate('MyCalendar');
                }}
              />
              <GridItem
                icon="clipboard-clock-outline"
                color="#6823fa"
                label="Memories"
              />
            </View>
            <View style={styles.GridContainer}>
              <GridItem
                icon="calendar-blank-multiple"
                color="#ff6ead"
                label="Todo List"
                onPress={() => {
                  navigation.navigate('Todo');
                }}
              />
              <GridItem
                icon="flag-variant-outline"
                color="#57d4fa"
                label="pages"
              />
            </View>
            <View style={styles.GridContainer}>
              <GridItem
                icon="android-messages"
                color="#2e2580"
                label="messages"
              />
              <GridItem icon="phone" color="#f74336" label="Audio Messages" />
            </View>
          </View>
          <View style={{width: '100%'}}>
            <List.Section>
              <List.Accordion
                title="Settings"
                style={{backgroundColor: theme.colors.surface,paddingVertical:0,elevation:2,marginBottom:0,
                borderRadius:5}}
                left={props => (
                  <List.Icon {...props} icon="shield-account-outline" />
                )}>
                <TouchableOpacity style={styles.AccordianMenu}>
                  <Icon
                    source="face-man-profile"
                    color={theme.colors.onSurfaceVariant}
                    size={25}
                  />
                  <List.Item title="profile setting" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.AccordianMenu}>
                  <Icon
                    source="alphabetical-variant"
                    color={theme.colors.onSurfaceVariant}
                    size={25}
                  />
                  <List.Item title="Language" />
                </TouchableOpacity>
              </List.Accordion>
            </List.Section>
          </View>
          <View style={{width: '100%'}}>
            <TouchableOpacity  onPress={() => {
                  navigation.navigate('EmailScreen');
                }}>
              <View style={styles.MenuItem}>
                <Divider />
                <Icon
                  source="email"
                  color={theme.colors.onSurfaceVariant}
                  size={25}
                />
                <Text style={styles.MenuText}>Email</Text>
                <Divider />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{width: '100%'}}>
            <View style={styles.MenuItem}>
              <Divider />
              <Icon
                source="moon-waning-crescent"
                color={theme.colors.onSurfaceVariant}
                size={25}
              />
              <Text style={styles.MenuText}>Dark mode </Text>
              <Switch
                style={{marginLeft: 145}}
                value={isSwitchOn}
                onValueChange={onToggleSwitch}
              />
              <Divider />
            </View>
          </View>

          <View style={{width: '100%'}}>
            <TouchableOpacity>
              <View style={styles.MenuItem}>
                <Divider />
                <Icon
                  source="account-multiple-plus-outline"
                  color={theme.colors.onSurfaceVariant}
                  size={25}
                />
                <Text style={styles.MenuText}>Invite Friends</Text>
                <Divider />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{width: '100%'}}>
            <TouchableOpacity>
              <View style={styles.MenuItem}>
                <Divider />
                <Icon
                  source="help-circle"
                  color={theme.colors.onSurfaceVariant}
                  size={25}
                />
                <Text style={styles.MenuText}>Help & support</Text>
                <Divider />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{width: '100%'}}>
            <TouchableOpacity>
              <View style={styles.MenuItem}>
                <Divider />
                <Icon
                  source="information-outline"
                  color={theme.colors.onSurfaceVariant}
                  size={25}
                />
                <Text style={styles.MenuText}>About us</Text>
                <Divider />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{width: '100%'}}>
            <TouchableOpacity>
              <View style={styles.MenuItem}>
                <Divider />
                <Icon
                  source="logout"
                  color={theme.colors.onSurfaceVariant}
                  size={25}
                />
                <Text style={styles.MenuText}>Log Out</Text>
                <Divider />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default Settings;

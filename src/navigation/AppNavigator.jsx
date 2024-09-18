import React, { useContext, useEffect } from 'react';
 import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import DeviceInfo from 'react-native-device-info';
import EncryptedStorage from 'react-native-encrypted-storage';
import Login from '../screens/Login';
import Register from '../screens/Register';
import TabNavigator from './TabNavigator';
import LeadDetail from '../screens/main/LeadDetail';
import Profile from '../screens/main/Profile';
import Todo from '../screens/main/Todo';
import MyCalendar from '../screens/main/MyCalaender';
import Settings from '../screens/main/Settings';
import CallDetails from '../components/CallDetails';
import NotificationScreen from '../components/NotificationScreen';
import EmailScreen from '../screens/main/EmailScreen';
import { AuthContext } from '../context/AuthProvider';
import EmailDetail from '../screens/main/EmailDetail';
import CreateLeads from '../screens/main/CreateLead';
import LeadsList from '../components/LeadsList';
import Leads from '../screens/main/Leads';
import EditProfile from '../components/EditProfile';
import FollowUpLeads from '../components/FollowUpLeads';
import FollowupLeadPage from '../screens/main/FollowupLeadPage';
import UserReport from '../screens/main/UserReport';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user } = useContext(AuthContext);

  const todayDate = new Date();
  const checkDate = `${todayDate.getFullYear()}-${todayDate.getMonth() + 1}-${todayDate.getDate()}`;

  // useEffect(() => {
  //   // Check if checkDate is not equal to tokenDate and reset EncryptedStorage if needed
  //   const resetStorageIfNeeded = async () => {
  //     const tokenDate = await EncryptedStorage.getItem('tokenDate');
  //     if (checkDate !== tokenDate) {
  //       await EncryptedStorage.clear();
  //     }
  //   };
  //   resetStorageIfNeeded();
  // }, [checkDate]); // Run the effect whenever checkDate changes

  const logDeviceInfo = async () => {
    try {
      const deviceManufacturer = await DeviceInfo.getManufacturer();
      const deviceModel = await DeviceInfo.getModel();
      console.log('Device Manufacturer:', deviceManufacturer);
      console.log('Device Model:', deviceModel);
    } catch (error) {
      console.error('Error fetching device information:', error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      logDeviceInfo();
    }, 1000);
  }, []);

  return (
    <Stack.Navigator screenOptions={{
      ...TransitionPresets.SlideFromRightIOS,headerShown: false 
   }} >
      {user ? (
        <>
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
          <Stack.Screen name="LeadDetail" component={LeadDetail} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Todo" component={Todo} />
          <Stack.Screen name="MyCalendar" component={MyCalendar} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="EmailScreen" component={EmailScreen} />
          <Stack.Screen name="EmailDetail" component={EmailDetail} />
          <Stack.Screen name="CallDetails" component={CallDetails} />
          <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
          <Stack.Screen name="CreateLeads" component={CreateLeads} />
          <Stack.Screen name="Leads" component={Leads} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="FollowUpLeads" component={FollowupLeadPage} />
          <Stack.Screen name="UserReport" component={UserReport} />
          


        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;

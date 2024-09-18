import React, { useState } from 'react';
import Home from '../screens/main/Home';
import CreateLead from '../screens/main/CreateLead';
import Leads from '../screens/main/Leads';
import Call from '../screens/main/Call';
import Settings from '../screens/main/Settings';
import { Drawer } from 'react-native-drawer-layout';
import AppDrawer from '../components/AppDrawer';
import { BottomNavigation, useTheme } from 'react-native-paper';
import CustomBanner from '../components/CustomBanner';
import CustomAlert from '../components/CustomAlert';
import MainHeader from './MainHeader';
import { Text } from 'react-native';

const TabNavigator = () => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const activeColor = '#0D6EFD';
  const inactiveColor = 'grey';
  const activeBackgroundColor = 'blue';
  const routes = [
    {
      key: 'Home',
      title: 'Home', // Add title for the tab
      focusedIcon: 'home',
      unfocusedIcon: 'home-outline',
    },
    {
      key: 'Leads',
      title: 'Leads',
      focusedIcon: 'format-list-bulleted',
      unfocusedIcon: 'format-list-checkbox',
    },
    {
      key: 'CreateLead',
      title: 'Create Lead',
      focusedIcon: 'plus-circle',
      unfocusedIcon: 'plus-circle-outline',
    },
    {
      key: 'Call',
      title: 'Call',
      focusedIcon: 'phone',
      unfocusedIcon: 'phone-outline',
    },
    {
      key: 'Settings',
      title: 'Settings',
      focusedIcon: 'account',
      unfocusedIcon: 'account-outline',
    },
  ];

  const renderScene = BottomNavigation.SceneMap({
    Home,
    Leads,
    CreateLead,
    Call,
    Settings,
  });

  const renderLabel = ({ route, color }) => (
    <Text style={{ color,alignSelf:'center', marginTop:-8}}>{route.title}</Text>
  );

  return (
    <>
      <Drawer
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        renderDrawerContent={() => <AppDrawer />}
      >
        <MainHeader showDrawer={() => setOpen(true)} />
        {/* <CustomBanner /> */}
        {/* <CustomAlert /> */}
        <BottomNavigation sceneAnimationType='shifting'
  navigationState={{ index, routes }}
  barStyle={{ backgroundColor: '#fefefe' }}
  activeColor={activeColor}
  inactiveColor={inactiveColor}
  style={{ padding: 0, marginBottom: -22, borderTopWidth: 0,}}
  labeled={true}
  compact={true}
  onIndexChange={setIndex}
  renderScene={renderScene}
  activeBackgroundColor={'#ffffff'}
  renderLabel={renderLabel}
  sceneAnimationEnabled={false}
/>
      </Drawer>
    </>
  );
};

export default TabNavigator;
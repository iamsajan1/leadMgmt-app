import React, { useState } from 'react';
import { useWindowDimensions, View, StyleSheet } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import LeadsList from '../../components/LeadsList';
 import { Icon } from 'react-native-paper';
import FollowUpLeads from '../../components/FollowUpLeads';
    
const renderScene = SceneMap({
  first: LeadsList,
  second:FollowUpLeads
 });

const Leads = (props) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: 'first',
      title: 'Leads',
      icon: 'format-list-bulleted',
      accessibilityLabel: 'Leads',
    },
    {
      key: 'second',
      title: 'Follow Up Leads',
      icon: 'another-icon-name',
      accessibilityLabel: 'Second Tab',
    },
  ]);
  const renderTabBar = (props) => (
    <TabBar
      {...props}
      renderIcon={({ focused, color }) => (
        <Icon name={focused ? 'albums' : 'albums-outlined'} color={color} />
      )}
      style={styles.tabBar}
      indicatorStyle={styles.indicator}
      activeColor={'#2e2e2e'}
      inactiveColor={'grey'}
      labelStyle={styles.tabLabel}
      tabStyle={styles.tab} // Adjust spacing between tabs
      scrollEnabled={true} // Enable scrolling for tabs
    />
  );

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
        initialLayout={{ width: layout.width }}
        backgroundColor={'#dedede'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#fff'
  },
  tabBar: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
    justifyContent: 'flex-start', // Align tabs to the left corner
  },
  indicator: {
    backgroundColor: '#9e9e9e',
    height: 2,
  },
  tabLabel: {
    fontSize: 14, // Set small font size
  },
  tab: {
    width: 'auto', // Allow tabs to occupy minimum space
    paddingStart: 6, // Remove any padding
    margin: 0, // Remove any margin
  },
});

export default Leads;
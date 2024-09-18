import * as React from 'react';
import {useContext} from 'react';
import {Pressable} from 'react-native';
import {View} from 'react-native';
import {
  Button,
  Menu,
  Divider,
  Icon,
  Avatar,
  useTheme,
  Card,
} from 'react-native-paper';
import {AuthContext} from '../context/AuthProvider';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
 
const MainHeader = props => {
  const [visible, setVisible] = React.useState(false);
  const {logout} = useContext(AuthContext);
  const openMenu = () => setVisible(true);
  const navigation = useNavigation();
  const closeMenu = () => setVisible(false);

  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent:"space-between",
        alignItems: 'center',
        backgroundColor: '#fefefe',
       }}>
        <View
        style={{ marginLeft:10}}>
      <Pressable
        onPress={props.showDrawer}>
        <Icon source={'dots-grid'} size={25} />
      </Pressable>
      </View>
      {/* <Pressable style={{marginLeft:45}}
        onPress={props.showDrawer}>
        <SelectUniversity />
      </Pressable> */}

      <View style={{flexDirection:'row',alignSelf:'center',alignItems:'center',alignContent:'center',justifyContent:'space-evenly'}}>
        <TouchableOpacity
          onPress={() => navigation.navigate('NotificationScreen')}>
          <View style={{marginRight:8}} >
            <Icon source={'bell-outline'} size={25} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Avatar.Image
          style={{backgroundColor:'white'}}
            size={25}
            source={require('../assets/images/useIcon.png')}
          />
        </TouchableOpacity>
        <View style={{marginRight:-20}}>
        <Menu
          contentStyle={{backgroundColor: '#FFFFFF'}}
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Button
              style={{
                alignItems: 'center',
                paddingHorizontal: 0,
                marginHorizontal: 0,
                backgroundColor: '#fff',
                marginRight:8
              }}
              onPress={openMenu}>
              <Icon source={'dots-vertical'} size={27} />
            </Button>
          }
          >
          <Menu.Item
            onPress={() => navigation.navigate('Profile')}
            title="Edit Profile"
          />
          <Menu.Item onPress={logout} title="Logout" />
        </Menu>
        </View>
      </View>
    </View>
  );
};

export default MainHeader;

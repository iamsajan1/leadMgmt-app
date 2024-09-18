import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import {styles} from '../styles/Stylesheet';
import {SucceededToaster} from '../components/utility/Toaster';
import {useNavigation} from '@react-navigation/native';
import { AuthContext } from '../context/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = props => {
  const {width, height} = Dimensions.get('window');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);
  const submit = async () => {
    const data = {
      username: userName,
      password: password,
    };
    console.log('Login data',data);
    if (userName !== '' && password !== '') {
      const userData = await login(data);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      console.log('User Data saved in AsyncStorage:', userData);
    } else {
      SucceededToaster('Please Enter Required Fields');
    }
  };
  return (
    <ImageBackground
      source={require('../assets/images/bg.jpg')}
      style={styles.bgImage}>
      <TouchableWithoutFeedback
        style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end'}}
        onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
           >
          <View style={styles.loginContainer}>
            <View style={styles.loginTextContainer}>
              <Text style={[styles.welcomeText]}>Hi Counsellor</Text>
              <Text style={[styles.welcomeSubText]}>Login To Your Account</Text>
            </View>
            <View style={styles.loginInnerContainer}>
              <TextInput
                label={'Email and UserName'}
                value={userName}
                mode="outlined"
                activeOutlineColor="grey"
                style={styles.inputBox}
                contentStyle={{paddingLeft: width * 0.04}}
                outlineStyle={{
                  borderRadius: height * 0.03,
                  borderColor: 'grey',
                }}
                onChangeText={actualData => setUserName(actualData)}
              />
 <View style={styles.inputBoxWrapper}>
         <TextInput
          value={password}
          label={'Password'}
          mode="outlined"
          secureTextEntry={!showPassword}
          activeOutlineColor="grey"
          style={styles.inputBox}
          contentStyle={{ paddingLeft: width * 0.04 }}
          outlineStyle={{
            borderRadius: height * 0.03,
            borderColor: 'grey',
          }}
          onChangeText={(actualData) => setPassword(actualData)}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowPassword(!showPassword)}>
          <Text>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
        </TouchableOpacity>
       </View> 

              <TouchableOpacity
                style={{
                  backgroundColor: '#34a8eb',
                  borderRadius: height * 0.02,
                  alignItems: 'center',
                  width: '100%',
                  paddingVertical: height * 0.015,
                  marginTop: height * 0.02,
                }}
                onPress={() => submit()}>
                {/* // onPress={() => navigation.navigate('TabNavigator')}> */}
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: height * 0.025,
                  }}>
                  Login
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  alignItems: 'flex-end',
                  width: '100%',
                }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Forgotpassword')}>
                  <Text
                    style={{
                      color: '#34a8eb',
                      fontWeight: 'bold',
                      fontSize: height * 0.016,
                      padding: height * 0.005,
                      textDecorationLine: 'underline',
                      marginVertical: height * 0.015,
                    }}>
                    Forgot Password ?
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginBottom: height * 0.03,
                }}>
                <Text style={{color: 'black', fontSize: height * 0.018}}>
                  Don't have an account ?
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Register')}>
                  <Text
                    style={{
                      textDecorationLine: 'underline',
                      fontWeight: 'bold',
                      marginLeft: width * 0.02,
                      fontSize: height * 0.017,
                      color: '#34a8eb',
                    }}>
                    Register Now
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
};

export default Login;

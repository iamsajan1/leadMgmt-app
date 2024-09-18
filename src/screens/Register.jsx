import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import {styles} from '../styles/Stylesheet';
import { registerService } from '../services/registerService';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthProvider';

const Register = props => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const navigation = useNavigation()
  const {register} = useContext(AuthContext)
  const handleRegister = async () => {
    const userData = {
      firstName: name,
      emailAddress: email,
      phone: phone,
    };
    if (name !== '' && email !== '' && phone !== '') {
      register(userData)
    }
  };
  const {width, height} = Dimensions.get('window');
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
          enabled>
          <View style={styles.loginContainer}>
            <View style={styles.loginTextContainer}>
              <Text style={[styles.welcomeText]}>Welcome </Text>
              <Text style={[styles.welcomeSubText]}>
                Register Here To Start Counselling.
              </Text>
            </View>
            <View style={styles.loginInnerContainer}>
              <TextInput
                value={name}
                label={'Name'}
                mode="outlined"
                activeOutlineColor="grey"
                style={styles.inputBox}
                contentStyle={{paddingLeft: width * 0.04}}
                outlineStyle={{
                  borderRadius: height * 0.03,
                  borderColor: 'grey',
                }}
                onChangeText={text => setName(text)}
              />
              <TextInput
                value={phone}
                label={'Phone Number'}
                mode="outlined"
                activeOutlineColor="grey"
                style={styles.inputBox}
                contentStyle={{paddingLeft: width * 0.04}}
                outlineStyle={{
                  borderRadius: height * 0.03,
                  borderColor: 'grey',
                }}
                onChangeText={text => setPhone(text)}
              />
              <TextInput
                value={email}
                label={'Email Address'}
                mode="outlined"
                activeOutlineColor="grey"
                style={styles.inputBox}
                contentStyle={{paddingLeft: width * 0.04}}
                outlineStyle={{
                  borderRadius: height * 0.03,
                  borderColor: 'grey',
                }}
                onChangeText={text => setEmail(text)}
              />
              <TouchableOpacity
                style={{
                  backgroundColor: '#34a8eb',
                  borderRadius: height * 0.02,
                  alignItems: 'center',
                  width: '100%',
                  paddingVertical: height * 0.015,
                  marginTop: height * 0.02,
                }}
                onPress={() => handleRegister()}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: height * 0.025,
                  }}>
                  Register
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: height * 0.02,
                  marginBottom: height * 0.04,
                }}>
                <Text style={{color: 'black'}}>Already have an account?</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Login')}>
                  <Text
                    style={{
                      textDecorationLine: 'underline',
                      fontWeight: 'bold',
                      marginLeft: width * 0.02,
                      fontSize: height * 0.017,
                      color: '#34a8eb',
                    }}>
                    Login Here
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

export default Register;

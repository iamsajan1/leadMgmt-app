import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import your desired icon set
import HeaderWithBackButton from './HeaderWithBackButton';

const EditProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');

  const handleSaveChanges = () => {
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Phone Number:', phoneNumber);
    console.log('Address:', address);
    console.log('Bio:', bio);
    setName('');
    setEmail('');
    setPhoneNumber('');
    setAddress('');
    setBio('');
  };

  return (
    <View style={styles.container}>
    <View style={{marginBottom:20}}>
      <HeaderWithBackButton headerText={' Edit Profile'} />
      </View>

      <View style={styles.card}>
        <Icon name="person" size={24} color="#666" style={styles.icon} />
        <TextInput
          label="Name"
          value={name}
          onChangeText={text => setName(text)}
          style={styles.input}
          right={<TextInput.Icon name="pencil" />}
        />
      </View>
      <View style={styles.card}>
        <Icon name="email" size={24} color="#666" style={styles.icon} />
        <TextInput
          label="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
          right={<TextInput.Icon name="pencil" />}
        />
      </View>
      <View style={styles.card}>
        <Icon name="phone" size={24} color="#666" style={styles.icon} />
        <TextInput
          label="Phone Number"
          value={phoneNumber}
          onChangeText={text => setPhoneNumber(text)}
          style={styles.input}
          right={<TextInput.Icon name="pencil" />}
        />
      </View>
      <View style={styles.card}>
        <Icon name="location-on" size={24} color="#666" style={styles.icon} />
        <TextInput
          label="Address"
          value={address}
          onChangeText={text => setAddress(text)}
          style={styles.input}
          right={<TextInput.Icon name="pencil" />}
        />
      </View>
      <View style={styles.card}>
        <Icon name="info" size={24} color="#666" style={styles.icon} />
        <TextInput
          label="Bio"
          value={bio}
          onChangeText={text => setBio(text)}
          multiline
          style={[styles.input, styles.bioInput]}
          right={<TextInput.Icon name="pencil" />}
        />
      </View>
      <Button mode="contained" onPress={handleSaveChanges} style={styles.button}>
        Save Changes
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    marginBottom: 30,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    elevation: 2, 
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor:'#fefefe' 
  },
  bioInput: {
    height: 100,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#2663f0',
    width:'50%',
    alignSelf:'center'
  },
});

export default EditProfileScreen;

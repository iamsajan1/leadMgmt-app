import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, Linking, Platform, PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';

const AddToContactsButton = ({ leadData }) => {
  const [permissionGranted, setPermissionGranted] = useState(false);

  const requestContactsPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
          {
            title: 'Contacts Permission',
            message: 'This app needs access to your contacts to add a new contact.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setPermissionGranted(true);
          return true;
        } else {
          console.log('Contacts permission denied');
          return false;
        }
      } else {
        // For iOS, no need to request permission, always granted
        setPermissionGranted(true);
        return true;
      }
    } catch (error) {
      console.error('Error requesting contacts permission:', error);
      return false;
    }
  };

  const handleAddToContacts = async () => {
    if (!permissionGranted) {
      const permissionStatus = await requestContactsPermission();
      if (!permissionStatus) return;
    }

    const contact = {
      phoneNumbers: [
        {
          label: 'mobile',
          number: leadData.phone,
        },
      ],
      givenName: leadData.fullName,
    };

    Contacts.addContact(contact, (err) => {
      if (err) {
        console.error('Error adding contact:', err);
      } else {
        console.log('Contact added successfully');
      }
    });
  };

  return (
    <TouchableOpacity
      style={styles.addToContactsButton}
      onPress={handleAddToContacts}>
      <Text style={styles.addToContactsButtonText}>Add {leadData.fullName} to Contacts</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  addToContactsButton: {
    backgroundColor: '#34a8eb',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addToContactsButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AddToContactsButton;

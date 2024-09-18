import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, Button } from 'react-native';
import { Avatar, Icon } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import HeaderWithBackButton from '../../components/HeaderWithBackButton';
import EncryptedStorage from 'react-native-encrypted-storage';
import { updateUser, userId } from '../../services/userService';
import Modal from 'react-native-modal';

const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
};

const screenWidth = Dimensions.get('window').width;

const pieData = [
  {
    name: 'Leads',
    population: 215,
    color: 'rgba(131, 167, 234, 1)',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'Calls',
    population: 28,
    color: '#F00',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'Emails',
    population: 52,
    color: 'red',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'Whatsapp',
    population: 85,
    color: 'yellow',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'Instagram',
    population: 11,
    color: 'rgb(0, 0, 255)',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
];

const Profile = () => {
  const [userData, setUserData] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [updatedUserData, setUpdatedUserData] = useState({});
  const navigation = useNavigation();

  const checkAuthentication = async () => {
    try {
      const storedUser = await EncryptedStorage.getItem('user_session');
      console.log('Stored User Session:', storedUser);
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        console.log('Parsed User Session Data:', userData);
        console.log('User ID:', userData.userId);
        setUserData(userData);
        setUpdatedUserData({ ...userData, userId: userData.userId }); // Initialize updatedUserData with user data including userId
  
        // Retrieve user details using the user ID
        const userDetails = await userId(userData.userId);
        console.log('User Details:', userDetails);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
    }
  };

  const updateUserProfile = async () => {
    try {
      console.log('Updated user profile:', updatedUserData);
      const response = await updateUser(updatedUserData); // Call the updateUser service
      console.log('Update response:', response);
      setModalVisible(false);
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <HeaderWithBackButton headerText={'profile'} />

        <View style={styles.card}>
          <View style={styles.avatarContainer}>
            <Avatar.Image
              style={styles.avatar}
              size={105}
              source={require('../../assets/images/useIcon.png')}
            />
            <TouchableOpacity
              style={styles.editIconContainer}
              onPress={() => setModalVisible(true)}
            >
              <Icon source="lead-pencil" size={20} color="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.detailsCard}>
            <Text style={styles.detailsCardTitle}>Your Account Details</Text>

            <View style={styles.detailsContainer}>
              <Text style={styles.detailsLabel}>Name:</Text>
              <Text style={styles.detailsValue}>{userData && userData.firstName}</Text>
            </View>

            <View style={styles.detailsContainer}>
              <Text style={styles.detailsLabel}>Email:</Text>
              <Text style={styles.detailsValue}>{userData && userData.emailAddress}</Text>
            </View>

            <View style={styles.detailsContainer}>
              <Text style={styles.detailsLabel}>Role:</Text>
              <Text style={styles.detailsValue}>{userData && userData.roleName}</Text>
            </View>

            <View style={styles.detailsContainer}>
              <Text style={styles.detailsLabel}>Organization:</Text>
              <Text style={styles.detailsValue}>{userData && userData.organizationName}</Text>
            </View>
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.detailsLabel1}>Your Daily Progress</Text>
          <View style={styles.chartContainer}>
            <PieChart
              data={pieData}
              width={screenWidth * 0.8}
              height={150}
              chartConfig={chartConfig}
              accessor={'population'}
              backgroundColor={'transparent'}
              absolute
            />
          </View>
        </View>

        <Modal
          isVisible={modalVisible}
          onSwipeComplete={() => setModalVisible(false)}
          swipeDirection={['down']}
          style={styles.modal}
        >
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={updatedUserData.firstName}
              onChangeText={(text) => setUpdatedUserData((prevState) => ({ ...prevState, firstName: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={updatedUserData.emailAddress}
              onChangeText={(text) => setUpdatedUserData((prevState) => ({ ...prevState, emailAddress: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Role"
              value={updatedUserData.roleName}
              onChangeText={(text) => setUpdatedUserData((prevState) => ({ ...prevState, roleName: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Organization"
              value={updatedUserData.organizationName}
              onChangeText={(text) => setUpdatedUserData((prevState) => ({ ...prevState, organizationName: text }))}
            />
            <Button title="Update" onPress={updateUserProfile} />
          </View>
        </Modal>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 3,
    marginTop: 20,
    padding: 16,
  },
  avatarContainer: {
    alignSelf: 'center',
    marginTop: -50,
    borderWidth: 7,
    borderRadius: 100,
    borderColor: 'white',
    position: 'relative',
    backgroundColor: 'white',
  },
  avatar: {
    alignSelf: 'center',
    borderColor: 'white',
    backgroundColor: 'white',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'grey',
    borderRadius: 15,
    padding: 5,
  },
  detailsCardTitle: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#fefefe',
  },
  detailsLabel: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  detailsValue: {
    fontSize: 16,
    color: 'black',
  },
  detailsLabel1: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    marginTop: 25,
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3,
    marginTop: 20,
    padding: 16,
  },
  chartContainer: {
    borderWidth: 0.3,
    borderRadius: 5,
    backgroundColor: '#f0efed',
    marginTop: 6,
  },
});

export default Profile;

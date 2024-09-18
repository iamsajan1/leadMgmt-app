import React, {useState, useEffect, useRef} from 'react';
import {
  ImageBackground,
  LogBox,
  Linking,
  Dimensions,
  PermissionsAndroid,
  KeyboardAvoidingView,
} from 'react-native';
import Modal from 'react-native-modal';

import {
  leadDetailStylesheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Button,
  ScrollView,
} from 'react-native';
import {
  LeadDetails,
  LeadId,
  getLeadById,
  getLeadCallDuration,
  postLeadCall,
  postLeadComments,
  updateLeads,
} from '../../services/leadService';
import {Avatar, Icon, TextInput as PaperTextInput} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import CallLogs from 'react-native-call-log';
import {FlatList} from 'react-native';
import {Email} from 'react-native-email';
import Contacts from 'react-native-contacts';

import HeaderWithBackButton from '../../components/HeaderWithBackButton';
import {SucceededToaster} from '../../components/utility/Toaster';
import {leadDetailStyles, styles} from '../../styles/Stylesheet';
import InputField from './InputField';
import ChangeStatus from '../../components/ChangeStatus';
import CallDetectorManager from 'react-native-call-detection';
import { timestampToDateTime } from '../../components/utility/stampTimeConverter';

const CommentListScreen = props => {
  const [comment, setComment] = useState('');
  const [leadComment, setLeadComment] = useState([]);
  console.log(leadComment);

  const fetchLeadComments = async id => {
    try {
      const data = await LeadDetails(id);
      console.log(
        'Raw timestamps from server:',
        data.data.map(comment => comment.timestamp),
      );
      setLeadComment(data.data);
    } catch (error) {
      console.error('Error fetching lead comments:', error);
    }
  };

  useEffect(() => {
    fetchLeadComments(props.lead);
  }, []);

  const handleCommentSubmit = async () => {
    if (comment.trim() !== '') {
      console.log(comment);
      const data = {
        leadId: props.lead,
        detail: comment,
      };
      console.log(data);
      const response = await postLeadComments(data);
      if (response.status === 200) {
        fetchLeadComments(props.lead);
      } else {
        console.error('Error:', response.status, response.statusText);
        console.error('Error:', response.createdByName);
      }
      setComment('');
    }
  };

  const formatTimestamp = timestamp => {
    try {
      const date = new Date(timestamp);
      const ISTOffset = 330 * 60 * 1000;
      const ISTTime = new Date(date.getTime() + ISTOffset);

      const optionsDate = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      const optionsTime = {
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZone: 'Asia/Kolkata', // Setting timezone to Indian Standard Time
      };
      const formattedDate = ISTTime.toLocaleDateString(undefined, optionsDate);
      const formattedTime = ISTTime.toLocaleTimeString(undefined, optionsTime);
      return {date: formattedDate, time: formattedTime};
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      console.log('Timestamp value:', timestamp);
      return {date: 'Invalid Timestamp', time: 'Invalid Timestamp'};
    }
  };

  return (
    <ScrollView style={{maxHeight: 400}}>
      <View style={leadDetailStyles.commentSection}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TextInput
            style={leadDetailStyles.commentInput}
            placeholderTextColor="black"
            placeholder="Type your comment here"
            value={comment}
            onChangeText={text => setComment(text)}
          />
          <Button
            style={leadDetailStyles.commentButton}
            color={'#006aff'}
            title="Comment"
            onPress={handleCommentSubmit}
          />
        </View>
        {leadComment.map((commentObj, index) => (
          <View
            key={index}
            style={[
              leadDetailStyles.commentContainer,
              commentObj.userType === 'admin' &&
                leadDetailStyles.adminCommentContainer,
            ]}>
            <View
              style={{flexDirection: 'row', marginTop: 10, marginBottom: -8}}>
              <Icon
                size={24}
                style={{borderBlockColor: 'gray'}}
                source="face-woman-profile"
              />
              <Text
                style={{
                  color: 'black',
                  alignSelf: 'center',
                  marginLeft: 10,
                  fontWeight: 'bold',
                }}>
                {commentObj.createdByName}
              </Text>
            </View>
            <View
              style={{
                borderWidth: 0.3,
                marginTop: 10,
                padding: 10,
                borderRadius: 8,
                backgroundColor: '#f0f0f0',
                paddingLeft: 20,
              }}>
              <Text style={leadDetailStyles.commentText}>
                {commentObj.detail}
              </Text>
              {/* Displaying the formatted Indian standard date and time */}
              <Text style={leadDetailStyles.timestamp}>
                {formatTimestamp(commentObj.createdDate).date}{' '}
                {formatTimestamp(commentObj.createdDate).time}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
const CallHistoryScreen = ({leadId}) => {
  console.log('Phone Number:', leadId);
  const [callHistory, setCallHistory] = useState([]);

  useEffect(() => {
    const fetchCallHistory = async leadId => {
      try {
        const response = await getLeadCallDuration(leadId);
        setCallHistory(response.data.items);
        console.log('Error fetching call history:', response.data);
      } catch (error) {
        console.error('Error fetching call history:', error);
      }
    };

    fetchCallHistory(leadId);
  }, [leadId]);
  const formatCallDuration = seconds => {
    const minutes = (seconds / 60).toFixed(2);
    return `${minutes}m`;
  };
  return (
    <FlatList
      data={callHistory}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <View style={leadDetailStyles.callLogItem}>
          <Text style={leadDetailStyles.logText}>{item.toPhone}</Text>

          <View style={{flexDirection: 'column-reverse'}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
              <Text style={leadDetailStyles.logText}>
                {formatCallDuration(item.callDuration)}
              </Text>
            </View>

            <Text style={leadDetailStyles.logText}>{item.callStart}</Text>
          </View>
          <View style={{flexDirection: 'column-reverse', alignItems: 'center'}}>
            <Text style={leadDetailStyles.logText}>
              ( {item.createdByName})
            </Text>

            <Text style={leadDetailStyles.logText}>{item.fromPhone}</Text>
          </View>
        </View>
      )}
    />
  );
};

const LeadDetail = ({route}) => {
  const [activeTab, setActiveTab] = useState('CommentList');
  const {leadId} = route.params;
  const callDetectorRef = useRef(null);
  const [leadData, setLeadData] = useState();
  const [showLeadInfo, setShowLeadInfo] = useState(true);
  const [updatedLeadData, setUpdatedLeadData] = useState({
    id: leadId,
    fullName: '',
    emailAddress: '',
    courseName: '',
    phone: '',
  });
  const {width} = Dimensions.get('window');
  const [isModalVisible, setModalVisible] = useState(false);
  const handleWhatsApp = () => {
    let formattedPhoneNumber = leadData && leadData.phone;
    if (formattedPhoneNumber) {
      // Check if phone number includes country code
      if (!formattedPhoneNumber.includes('+')) {
        // If country code is not present, add +91 (India country code)
        formattedPhoneNumber = '+91' + formattedPhoneNumber;
      }
      Linking.openURL(`whatsapp://send?phone=${formattedPhoneNumber}`).catch(
        error => {
          console.error('Error opening WhatsApp:', error);
        },
      );
    } else {
      console.warn('Phone number is not available');
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };
  const handleArrowClick = () => {
    setShowLeadInfo(!showLeadInfo);
  };

  const handleEmail = () => {
    const toEmail = leadData && leadData.emailAddress;
    if (toEmail) {
      Linking.openURL(`mailto:${toEmail}?subject=Subject&body=Body`).catch(
        error => console.error('Error opening email app:', error),
      );
    } else {
      console.warn('Email address is not available');
    }
  };
  const toggleModal = async () => {
    await fetchLeadData(leadId);
    setModalVisible(!isModalVisible);
  };
  useEffect(() => {
    if (isModalVisible) {
      fetchLeadData(leadId);
    }
  }, [isModalVisible]);
  const handleUpdateLead = async () => {
    try {
      const response = await updateLeads(updatedLeadData);
    } catch (error) {
      console.error('Error updating lead:', error);
    }
    toggleModal();
  };

  const handleLeadDetailChange = (field, value) => {
    setUpdatedLeadData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };
  toggleModal;

  // const fetchLeadData = async id => {
  //   const data = await getLeadById(id);
  //   setLeadData(data.data);
  // };

  useEffect(() => {
    fetchLeadData(leadId);
  }, [leadId]);
  const fetchLeadData = async id => {
    try {
      const data = await getLeadById(id);
      setUpdatedLeadData(data.data);
      setLeadData(data.data);
    } catch (error) {
      console.error('Error fetching lead data:', error);
    }
  };

  const handleSaveToContacts = async () => {
    if (leadData && leadData.phone && leadData.fullName) {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
            {
              title: 'Contacts Permission',
              message:
                'This app needs access to your contacts to add a new contact.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Contacts permission denied');
            return;
          }
        }

        const newContact = {
          givenName: leadData.fullName,
          phoneNumbers: [{label: 'mobile', number: leadData.phone}],
        };

        // Open the contact picker to allow the user to edit and save the contact
        await Contacts.openContactForm(newContact);
        // You may add a success toast or message here
      } catch (error) {
        console.error('Error adding contact:', error);
      }
    } else {
      console.warn('Lead data is incomplete or missing');
    }
  };
  const [contacts, setContacts] = useState([]);
  const [modalStatusVisible, setModalStatusVisible] = useState(false);
  const [editedValue, setEditedValue] = useState('');  
  const [inCall, setInCall] = useState(false);
  const [callNumber, setCallNumber] = useState('');  
  const [leadIdForComment, setLeadIdForComment] = useState(null);

  const handleCommentSubmit = async selectedStatus => {
    if (editedValue.trim() === '' || !leadIdForComment) return;

    const data = {
      leadId: leadData.id,
      detail: editedValue,
      status: selectedStatus,
    };
    try {
      const response = await postLeadComments(data);

      if (response.ok) {
        const responseData = await response.json();
        console.log('Response Data:', responseData);

        // Refresh the list after successfully posting the comment
      } else {
        console.error('Error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setModalStatusVisible(false);
      setEditedValue('');
    }
  };

  
  useEffect(() => {
    setupCallDetector();
    return () => {
      callDetectorRef.current.dispose();
    };
  }, []);
  const setupCallDetector = () => {
    callDetectorRef.current = new CallDetectorManager(
      async (event, number) => {
        console.log('Call Event:', event, 'Number:', number);

        if (event === 'Disconnected') {
          console.log('Disconnected event occurred.');
          Linking.openURL('aps://back').catch(err => {});
          await handleDisconnected();
          setInCall(false);
        }

        const contact = contacts.find(contact => contact.phone === number);
        if (contact) {
          setCallLogs(prevLogs => [
            ...prevLogs,
            {
              phoneNumber: number,
              event,
              timestamp: new Date().getTime(),
              type: event === 'INCOMING' ? 1 : 2,
            },
          ]);
        }
      },
      true,
      () => {},
      {
        title: 'Phone State Permission',
        message: 'This app needs access to your phone state',
      },
    );
  };
  const handleCallButton = async (phoneNumber, leadData) => {
    console.log('Selected Lead ID:', leadData);
    if (!inCall && phoneNumber) {
      try {
        await Linking.openURL(`tel:${phoneNumber}`);
        setInCall(true);
        setCallNumber(phoneNumber);

        setLeadIdForComment(leadData.id);
      } catch (error) {
        console.error('Error initiating call:', error);
      }
    }
  };

  const handleDisconnected = async () => {
    const lastCallLog = await getLastCallLog(callNumber);
      try {
        const timestamp = timestampToDateTime(lastCallLog.timestamp);   
        const data = {
          leadId: leadId,
          fromPhone:'0000000000',
          toPhone: lastCallLog.phoneNumber.toString(),
          callDuration: lastCallLog.duration.toString(),
          callStart: lastCallLog.dateTime.toString(),
          callEnd: timestamp.toString(),
          callType: 1,
        };

        console.log('Phone call Data', data);
        const response = await postLeadCall(data);
        console.log('Last Call response:', response.data);
        setInCall(false);
        setModalStatusVisible(true);
        Linking.openURL('com.aps://').catch(err => {});
      } catch (error) {
        console.error('Error posting lead call:', error);
        setInCall(false);
      }

    setInCall(false);
  };

  const getLastCallLog = phoneNumber => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        CallLogs.load(1, null, phoneNumber)
          .then(logs => {
            if (logs && logs.length > 0) {
              resolve(logs[0]);
            } else {
              reject(new Error('No call logs found.'));
            }
          })
          .catch(error => {
            reject(error);
          });
      }, 5000);
    });
  };
  return (
    <View style={{flex: 1, backgroundColor: '#86c5eb'}}>
      <Modal
        animationType="slide"
        transparent={true}
        swipeDirection={['down']}
        visible={isModalVisible}
        onSwipeComplete={() => setModalVisible(false)}
        onRequestClose={toggleModal}
        style={{justifyContent: 'flex-end', margin: 0}}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{
            flex: 1,
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              width: '100%',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                padding: 22,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                maxHeight: '90%', 
                overflow: 'hidden',
                marginTop: '100%',
                width: '100%', 
              }}>
              <ScrollView>
                <InputField
                  style={styles.inputBox}
                  label="Full Name"
                  activeOutlineColor="grey"
                  contentStyle={{paddingLeft: width * 0.04}}
                  outlineStyle={{borderColor: 'grey'}}
                  value={updatedLeadData.fullName}
                  mode="outlined"
                  onChangeText={text =>
                    handleLeadDetailChange('fullName', text)
                  }
                />
                <InputField
                  style={styles.inputBox}
                  label="Email Address"
                  value={updatedLeadData.emailAddress}
                  activeOutlineColor="grey"
                  contentStyle={{paddingLeft: width * 0.04}}
                  outlineStyle={{borderColor: 'grey'}}
                  mode="outlined"
                  onChangeText={text =>
                    handleLeadDetailChange('emailAddress', text)
                  }
                />
                <InputField
                  style={styles.inputBox}
                  label="Course Name"
                  activeOutlineColor="grey"
                  contentStyle={{paddingLeft: width * 0.04}}
                  outlineStyle={{borderColor: 'grey'}}
                  value={updatedLeadData.courseName}
                  mode="outlined"
                  onChangeText={text =>
                    handleLeadDetailChange('courseName', text)
                  }
                />
                 <InputField
                  style={styles.inputBox}
                  label="Phone"
                  activeOutlineColor="grey"
                  contentStyle={{paddingLeft: width * 0.04}}
                  outlineStyle={{borderColor: 'grey'}}
                  value={updatedLeadData.phone}
                  mode="outlined"
                  onChangeText={text =>
                    handleLeadDetailChange('alternateEmailAddress', text)
                  }
                />
                <InputField
                  style={styles.inputBox}
                  label="Alternate Email Address"
                  activeOutlineColor="grey"
                  contentStyle={{paddingLeft: width * 0.04}}
                  outlineStyle={{borderColor: 'grey'}}
                  value={updatedLeadData.alternateEmailAddress}
                  mode="outlined"
                  onChangeText={text =>
                    handleLeadDetailChange('alternateEmailAddress', text)
                  }
                />
                <InputField
                  style={styles.inputBox}
                  label="Alternate Phone Number"
                  activeOutlineColor="grey"
                  contentStyle={{paddingLeft: width * 0.04}}
                  outlineStyle={{borderColor: 'grey'}}
                  mode="outlined"
                  value={updatedLeadData.alternatePhone}
                  onChangeText={text =>
                    handleLeadDetailChange('alternatePhone', text)
                  }
                />
                <InputField
                  style={styles.inputBox}
                  label="description"
                  activeOutlineColor="grey"
                  contentStyle={{paddingLeft: width * 0.04}}
                  outlineStyle={{borderColor: 'grey'}}
                  mode="outlined"
                  value={updatedLeadData.description}
                  onChangeText={text =>
                    handleLeadDetailChange('description', text)
                  }
                />
              </ScrollView>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  marginTop: 12,
                }}>
                <Button
                  title="Cancel"
                  onPress={toggleModal}
                  color="#888"
                  style={leadDetailStyles.modalButton} // Apply custom style
                />
                <Button
                  title="Update"
                  onPress={handleUpdateLead}
                  color="#006aff"
                  style={leadDetailStyles.modalButton} // Apply custom style
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <HeaderWithBackButton headerText={'Lead details'} />
      <View style={leadDetailStyles.container}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={leadDetailStyles.PersonalDetailText}
              onPress={handleArrowClick}>
              Lead Information{' '}
              <Icon
                source={showLeadInfo ? 'chevron-up' : 'chevron-down'}
                color="black"
                size={20}
              />
            </Text>
            <TouchableOpacity
              onPress={toggleModal}
              style={{marginLeft: 'auto'}}>
              <Icon source="pencil" size={20} color="black" />
            </TouchableOpacity>
          </View>

          {showLeadInfo && leadData && (
            <View style={leadDetailStyles.detailsContainer}>
              <View style={leadDetailStyles.detailsRow}>
                <Text style={leadDetailStyles.detailsLabel}>Full Name:</Text>
                <Text style={leadDetailStyles.detailsValue}>
                  {leadData.fullName}
                </Text>
              </View>
              <View style={leadDetailStyles.detailsRow}>
                <Text style={leadDetailStyles.detailsLabel}>Course:</Text>
                <Text style={leadDetailStyles.detailsValue}>
                  {leadData.courseName}
                </Text>
              </View>
              <View style={leadDetailStyles.detailsRow}>
                <Text style={leadDetailStyles.detailsLabel}>Email:</Text>
                <Text style={leadDetailStyles.detailsValue}>
                  {leadData.emailAddress}
                </Text>
              </View>
              <View style={leadDetailStyles.detailsRow}>
                <Text style={leadDetailStyles.detailsLabel}>Lead Created:</Text>
                <Text style={leadDetailStyles.detailsValue}>
  {formatDate(leadData.createdDate)}
</Text>

              </View>
              <View style={leadDetailStyles.detailsRow}>
                <Text style={leadDetailStyles.detailsLabel}>Last Update:</Text>
                <Text style={leadDetailStyles.detailsValue}>10 May</Text>
              </View>
            </View>
          )}
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: 5,
            marginLeft: 8,
          }}>
          <TouchableOpacity
            style={leadDetailStyles.callbtn1}
            onPress={() => handleCallButton(leadData.phone, leadData)}>
            <Icon source="phone" color="#006aff" size={25}  />
          </TouchableOpacity>
          <TouchableOpacity
            style={leadDetailStyles.callbtn2}
            onPress={handleWhatsApp}>
            <Icon source="whatsapp" color="#069e28" size={25} />
          </TouchableOpacity>
          <TouchableOpacity
            style={leadDetailStyles.callbtn3}
            onPress={handleEmail}>
            <Icon source="email-outline" color="#eb312b" size={25} />
          </TouchableOpacity>
          <TouchableOpacity
            style={leadDetailStyles.callbtn4}
            onPress={handleSaveToContacts}>
            <Icon source="account-plus" color="#7409e6" size={25} />
          </TouchableOpacity>
          <View></View>
          <View></View>
        </View>
        <View style={leadDetailStyles.tabsContainer}>
          <TouchableOpacity
            style={[
              leadDetailStyles.tab,
              activeTab === 'CommentList' && leadDetailStyles.activeTab,
            ]}
            onPress={() => setActiveTab('CommentList')}>
            <Text style={{fontWeight: 'bold', fontSize: 16, color: 'black'}}>
              Comments
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              leadDetailStyles.tab,
              activeTab === 'History' && leadDetailStyles.activeTab,
            ]}
            onPress={() => setActiveTab('History')}>
            <Text style={{fontWeight: 'bold', fontSize: 16, color: 'black'}}>
              {' '}
              Call History
            </Text>
          </TouchableOpacity>
        </View>
        {leadData ? (
          <>
            {activeTab === 'CommentList' ? (
              <CommentListScreen lead={leadId} />
            ) : (
              <CallHistoryScreen phoneNumber={leadData.phone} leadId={leadId} />
            )}
          </>
        ) : (
          <Text>Loading lead data...</Text>
        )}
      </View>
      <ChangeStatus
        contacts={contacts}
        modalVisible={modalStatusVisible}
        setModalVisible={setModalStatusVisible}
        setEditedValue={setEditedValue}
        selectedItemIndex={contacts.selectedItemIndex}
        leadIdForComment={leadId}
        handleCommentSubmit={(selectedStatus)=>handleCommentSubmit(selectedStatus)}
      />
    </View>
    
  );
};

export default LeadDetail;
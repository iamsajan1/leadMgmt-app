import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, Linking, Modal, View, Text } from 'react-native';
import { Icon } from 'react-native-paper'; // Correct import
import CallDetectorManager from 'react-native-call-detection';
import CallLogs from 'react-native-call-log';
import { timestampToDateTime } from './utility/stampTimeConverter';
import { postLeadCall } from '../../services/leadService';
 
const CallButton = ({ phoneNumber, leadData, userPhoneNumber, onCallEnd }) => {
  const [inCall, setInCall] = useState(false);
  const [callNumber, setCallNumber] = useState('');
  const [callStartTime, setCallStartTime] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const callDetectorRef = useRef(null);

  useEffect(() => {
    setupCallDetector();
    return () => {
      if (callDetectorRef.current) {
        callDetectorRef.current.dispose();
      }
    };
  }, []);

  const setupCallDetector = () => {
    callDetectorRef.current = new CallDetectorManager(
      async (event, number) => {
        if (event === 'Disconnected') {
          await handleDisconnected();
          setInCall(false);
        }

        if (event === 'Offhook') {
          setCallStartTime(new Date().getTime());
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

  const handleCallButtonPress = async () => {
    if (!inCall && phoneNumber) {
      try {
        await Linking.openURL(`tel:${phoneNumber}`);
        setCallNumber(phoneNumber);
        setInCall(true);
        setModalVisible(true);
      } catch (error) {
        console.error('Error initiating call:', error);
      }
    }
  };

  const handleDisconnected = async () => {
    const lastCallLog = await getLastCallLog(callNumber);
    if (leadData && lastCallLog) {
      try {
        const timestamp = timestampToDateTime(lastCallLog.timestamp);
        const data = {
          leadId: leadData.id,
          fromPhone: userPhoneNumber.toString(),
          toPhone: lastCallLog.phoneNumber.toString(),
          callDuration: lastCallLog.duration.toString(),
          callStart: lastCallLog.dateTime.toString(),
          callEnd: timestamp.toString(),
          callType: 1,
        };

        await postLeadCall(data);
        onCallEnd();
      } catch (error) {
        console.error('Error posting lead call:', error);
      }
    }
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
    <>
      <TouchableOpacity onPress={handleCallButtonPress}>
        <Icon icon="phone" color="#1875f0" size={30} /> {/* Fixed the Icon usage */}
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        transparent={true}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: 300, padding: 20, backgroundColor: '#fff', borderRadius: 10 }}>
            <Text>Call ended. Add your comments below:</Text>
            {/* Additional UI for entering comments */}
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default CallButton;

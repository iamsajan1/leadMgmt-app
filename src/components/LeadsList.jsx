import React, {useState, useEffect, useRef} from 'react';
import {
  FlatList,
  Text,
  View,
  RefreshControl,
  TouchableOpacity,
  Linking,
  BackHandler,
  Image,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import {Avatar, Icon, Searchbar, TextInput} from 'react-native-paper';
import CallDetectorManager from 'react-native-call-detection';
import {useNavigation} from '@react-navigation/native';
import ChangeStatus from './ChangeStatus';
import {TextInput as NormalInput} from 'react-native';
import {
  getLeads,
  postLeadCall,
  postLeadComments,
} from '../services/leadService';
import EncryptedStorage from 'react-native-encrypted-storage';
import * as Animatable from 'react-native-animatable';

import CallLogs from 'react-native-call-log';
import {formatDateString, timestampToDateTime} from './utility/stampTimeConverter';
import {SucceededToaster} from './utility/Toaster';
import {userId} from '../services/userService';
import FilterModal from './utility/LeadListFilterModal';
import { objectName } from './utility/findFunction';

const loadingGif = require('../assets/images/loading.gif');

const LoadingIndicator = () => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
    }}>
    <FastImage
      source={loadingGif}
      style={{width: 100, height: 100}}
      resizeMode={FastImage.resizeMode.contain}
    />
  </View>
);

const LeadsList = ({route}) => {
  const navigation = useNavigation();
  const callDetectorRef = useRef(null);
  const [callLogs, setCallLogs] = useState([]);
  const [callStates, setCallStates] = useState([]);
  const [callNumber, setCallNumber] = useState('');
  const [callStartTime, setCallStartTime] = useState(null);
  const [inCall, setInCall] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [colorsReset, setColorsReset] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [leadIdForComment, setLeadIdForComment] = useState(null);
  const [whatsappModalVisible, setWhatsappModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModalAfterCall, setShowModalAfterCall] = useState(false);
  const [lastAccessDate, setLastAccessDate] = useState(new Date());
  const [selectedStatusId, setSelectedStatusId] = useState(1);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const [searchInput, setSearchInput] = useState('');
  console.log(selectedStatusId);
  const [hasMoreLeads, setHasMoreLeads] = useState(true);
  const predefinedMessages = [
    'Hello, I am interested in your services.',
    'Can you provide more information about the courses?',
    'Hi, Sajan this side ',
    'Hello, I am interested in your services.',
    'Can you provide more information about the courses?',
    'Hi, Sajan this side ',
  ];
  const handleApplyFilter = statusId => {
     setSelectedStatusId(statusId);
    setFilterModalVisible(false);
    fetchLeads(statusId, pageNumber, searchQuery, dateRange); // Pass the dateRange correctly
  };
  
  const getStatusName = (statusId) => {
    const status = leadStatusData.find(status => status.id === statusId);
    return status ? status.name : 'Unknown Status';  // Default to 'Unknown Status' if no match found
  };
  const leadStatusData = [
    {id: 0, name: 'Any '},
    {id: 1, name: 'New Lead'},
    {id: 2, name: 'Prospect'},
    {id: 3, name: 'Cold'},
    {id: 4, name: 'Hot'},
    {id: 5, name: 'Attempting to Contact'},
    {id: 6, name: 'Dropped or Not Interested'},
    {id: 7, name: 'Invalid / Junk'},
    {id: 8, name: 'Follow Up For Next Session'},
    {id: 9, name: 'Submitted'},
    {id: 10, name: 'Closed Lost'},
    {id: 11, name: 'Not Reachable'},
    {id: 12, name: 'CallBack and Follow Up'},
    {id: 13, name: 'Rejected'},
    {id: 14, name: 'Language Barrier'},
    {id: 15, name: 'Not Eligible'},
    {id: 16, name: 'Enrolled'},
  ];
  const [userData, setUserData] = useState(null);
  const [userPhoneNumber, setUserPhoneNumber] = useState('');
  const checkAuthentication = async () => {
    try {
      const storedUser = await EncryptedStorage.getItem('user_session');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUserData(userData);
        const userDetails = await userId(userData.userId);
        console.log('User Details:', userDetails);
        setUserPhoneNumber(userDetails.data.phone);
        console.log('Phone from User Details:', userDetails.data.phone);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
    }
  };

  // Call checkAuthentication when the component mounts
  useEffect(() => {
    checkAuthentication();
  }, []);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);

  const handleItemPress = index => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  const onRefresh = React.useCallback(async () => {
    await fetchLeads(selectedStatusId, 1);
  }, [selectedStatusId]);

  useEffect(() => {
    setPageNumber(1);
  }, [selectedStatusId]);
  useEffect(() => {
    setupCallDetector();
    fetchLeads(selectedStatusId, pageNumber, searchQuery);
    if (showModalAfterCall) {
      setModalVisible(true);
      setShowModalAfterCall(false);
    }

    const backAction = () => {
      if (modalVisible) {
        setModalVisible(false);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => {
      backHandler.remove();
    };
  }, [
    showModalAfterCall,
    modalVisible,
    selectedStatusId,
    searchQuery,
    fetchLeads,
    pageNumber,
  ]);

  const handleSearchInputChange = query => {
    setSearchInput(query);
  };

  // Function to handle selecting status

  const handleSearchButtonPress = async () => {
    setSearchQuery(searchInput);
    setPageNumber(1); // Reset page number to 1
    fetchLeads(selectedStatusId, 1, searchInput); // Fetch leads with new search query
  };
  useEffect(() => {
    const currentDate = new Date();
    if (currentDate.getDate() !== lastAccessDate.getDate()) {
      setColorsReset(true);
      setLastAccessDate(currentDate);
    }
  }, []);

  const fetchLeads = async (selectedStatusId, pageNumber, searchQuery, dateRange = { startDate: null, endDate: null }) => {
    setLoading(true);
    setRefreshing(true);
  
    try {
      const currentPageNumber = searchQuery ? 1 : pageNumber;
      const startDate = dateRange?.startDate || null;  // Use optional chaining and default value
      const endDate = dateRange?.endDate || null;      // Use optional chaining and default value
  
      const response = await getLeads(
        selectedStatusId,
        currentPageNumber,
        searchQuery,
        10,
        startDate,
        endDate
      );
  
      console.log('API Response:', response);
  
      if (response && response.data) {
        const responseData = response.data;
        const apiLeads = responseData.items || [];
        const totalLeads = responseData.totalCount || 0;
  
        console.log('Total number of leads:', totalLeads);
  
        if (currentPageNumber === 1) {
          setContacts(apiLeads);
        } else {
          setContacts(prevContacts => {
            const newLeads = apiLeads.filter(
              newLead =>
                !prevContacts.some(prevLead => prevLead.id === newLead.id),
            );
            return [...prevContacts, ...newLeads];
          });
        }
  
        if ((currentPageNumber - 1) * 10 + apiLeads.length >= totalLeads) {
          setHasMoreLeads(false);
        } else {
          setHasMoreLeads(true);
        }
      }
      setRefreshing(false);
    } catch (error) {
      console.error('Error loading Lead: ', error);
      setRefreshing(false);
    } finally {
      setLoading(false);
    }
  };
  
  
  

  useEffect(() => {
    setupCallDetector();
    fetchLeads(selectedStatusId, pageNumber);
    return () => {
      callDetectorRef.current.dispose();
    };
  }, [pageNumber]);
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

          if (event === 'Offhook') {
            setCallStartTime(new Date().getTime());
          }
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
    if (!inCall && phoneNumber) {
        try {
            await Linking.openURL(`tel:${phoneNumber}`);
            setCallStates([]);
            setCallStartTime(new Date().getTime());
            setInCall(true);
            setCallNumber(phoneNumber);
            setShowModalAfterCall(true);
            setSelectedLead(leadData);
            setLeadIdForComment(leadData.id);
        } catch (error) {
            console.error('Error initiating call:', error);
        }
    }
};


const handleDisconnected = async () => {
  try {
      const lastCallLog = await getLastCallLog(callNumber);

      if (lastCallLog && lastCallLog.phoneNumber === callNumber) {
          if (selectedLead != null) {
              const timestamp = timestampToDateTime(lastCallLog.timestamp);
              const data = {
                  leadId: selectedLead.id,
                  fromPhone: userPhoneNumber.toString(),
                  toPhone: lastCallLog.phoneNumber.toString(),
                  callDuration: lastCallLog.duration.toString(),
                  callStart: lastCallLog.dateTime.toString(),
                  callEnd: timestamp.toString(),
                  callType: 1,
              };

              console.log('Phone call Data', data);
              const response = await postLeadCall(data);
              console.log('Last Call response:', response.data);
              setSelectedLead(null);
              setInCall(false);
              setModalVisible(true);
              Linking.openURL('com.aps://').catch(err => {});
          }
      } else {
          console.log('No matching call log found for posting.');
      }
  } catch (error) {
      console.error('Error handling disconnected call:', error.message);
  } finally {
      setInCall(false);
  }
};



const getLastCallLog = phoneNumber => {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          CallLogs.load(5, null, phoneNumber) // Load the last 5 call logs
              .then(logs => {
                  if (logs && logs.length > 0) {
                      // Filter logs that match the phone number
                      const matchingLogs = logs.filter(log => log.phoneNumber === phoneNumber);
                      
                      if (matchingLogs.length > 0) {
                          // Sort the matching logs by timestamp and get the latest one
                          matchingLogs.sort((a, b) => b.timestamp - a.timestamp);
                          resolve(matchingLogs[0]);
                      } else {
                          reject(new Error('No matching call log found.'));
                      }
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



  const handleEditButton = (index, lead) => {
    setSelectedItemIndex(index);
    setModalVisible(true);
    setSelectedLead(lead);
  };

  const handleWhatsappMessage = message => {
    const whatsappUrl = `whatsapp://send?phone=+91${callNumber}&text=${encodeURIComponent(
      message,
    )}`;
    Linking.openURL(whatsappUrl).catch(err => {});
    setWhatsappModalVisible(false);
  };


  return (
    <>
      <Modal
        isVisible={filterModalVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        onBackdropPress={() => setFilterModalVisible(false)}
        onSwipeComplete={() => setFilterModalVisible(false)}
        swipeDirection={['down']}
        style={{
          justifyContent: 'flex-end',
          margin: 0,
          height: '50%',
        }}>
        <FilterModal
          leadStatusData={leadStatusData}
          applyFilter={handleApplyFilter}
          selectedStatusId={selectedStatusId}
          dateRange={dateRange}
          setDateRange={setDateRange} 
        />
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={whatsappModalVisible}
        onRequestClose={() => setWhatsappModalVisible(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            marginBottom: -190,
          }}>
          <View
            style={{
              backgroundColor: 'transparent',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 10,
                padding: 20,
                width: '100%',
                height: '70%',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginBottom: 10,
                  color: 'blue',
                }}>
                Select message:
              </Text>
              <FlatList
                data={predefinedMessages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    style={{
                      padding: 5,
                      marginBottom: 5,
                      alignSelf: 'flex-start',
                      borderRadius: 5,
                      alignItems: 'center',
                    }}
                    onPress={() => handleWhatsappMessage(item)}>
                    <Text style={{color: 'grey'}}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  backgroundColor: '#0D6EFD',
                  padding: 8,
                  paddingHorizontal: 16,
                  borderRadius: 5,
                  alignItems: 'center',
                }}
                onPress={() => setWhatsappModalVisible(false)}>
                <Text style={{color: 'white'}}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <NormalInput
          style={{
            width: '65%',
            marginLeft: 15,
            verticalAlign: 'middle',
            height: 50,
            backgroundColor: '#FFFF',
            borderWidth: 0.2,
            marginRight: 10,
            borderRadius: 10,
            paddingHorizontal: 10,
            marginTop: 5,
          }}
          placeholder="Search leads"
          onChangeText={handleSearchInputChange}
          value={searchInput}
        />
        <TouchableOpacity onPress={handleSearchButtonPress}>
          <Icon
            source="magnify"
            type="material-community"
            color="#1875f0"
            size={25}
            style={{marginLeft: 15}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{marginLeft: 20}}
          onPress={() => setFilterModalVisible(true)}>
          <Icon source="filter-variant" size={30} color="#1875f0" />
        </TouchableOpacity>

    
      </View>
      {/* {loading ? ( 
        <FlatList
          data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
          renderItem={() => (
            <SkeletonView render={1} width={330} height={60} borderRadius={20} direction="column" />
          )}
          keyExtractor={(item, index) => index.toString()}
           showsVerticalScrollIndicator={false} 
        />
      ) : ( */}
      <FlatList
        data={contacts}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({item, index}) => (
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 4,
                backgroundColor: item.sourceId == 4 ? '#f7f0e6' : '#fff',
                borderRadius: 10,
                marginVertical: 2,
                marginHorizontal: 8,
                elevation: 2,
                position: 'relative',
              }}>
              {selectedStatusId == 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: -1,
                    right: -1,
                    backgroundColor: '#f3f3f3',
                    paddingVertical: 2,
                    paddingHorizontal: 6,
                    borderRadius: 5,
                    zIndex: 1,
                  }}>
                  <Text
                    style={{color: '#000', fontSize: 10, fontWeight: 'bold'}}>
                    {objectName(leadStatusData, item.status)}
                  </Text>
                </View>
              )}
              {item.sourceId == 4 && (
                <View
                  style={{
                    position: 'absolute',
                    top: -1,
                    right: -1,
                    backgroundColor: '#FFD700',
                    paddingVertical: 2,
                    paddingHorizontal: 6,
                    borderRadius: 5,
                    zIndex: 1,
                  }}>
                  <Text
                    style={{color: '#000', fontSize: 10, fontWeight: 'bold'}}>
                    CAMPAIGN
                  </Text>
                </View>
              )}

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Animatable.View
                  animation="fadeInUp"
                  duration={1000}
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Animatable.View
                    animation="zoomIn"
                    duration={1000}
                    delay={500}
                    style={{marginRight: 10}}>
                    <TouchableOpacity onPress={() => handleItemPress(index)}>
                      <Avatar.Text
                        size={55}
                        label={item.fullName.charAt(0)}
                        color="white"
                        style={{backgroundColor: '#0D6EFD'}}
                      />
                    </TouchableOpacity>
                  </Animatable.View>
                  <Animatable.View
                    animation="fadeInRight"
                    duration={500}
                    delay={300}
                    style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('LeadDetail', {leadId: item.id})
                      }>
                      <View>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: 'grey',
                          }}>
                          {item.fullName.length > 14
                            ? item.fullName.slice(0, 14) + '...'
                            : item.fullName}
                        </Text>
                        <Text style={{color: 'grey'}}>{item.phone}</Text>
                        <Text style={{color: 'grey'}}>
                          {item.courseName.length > 10
                            ? `${item.courseName.slice(0, 10)}...`
                            : item.courseName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </Animatable.View>
                </Animatable.View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  style={{marginRight: 15}}
                  onPress={() => {
                    setWhatsappModalVisible(true);
                    setCallNumber(item.phone);
                  }}>
                  <Icon
                    source="whatsapp"
                    type="font-awesome"
                    color="#029c0c"
                    size={30}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginRight: 15}}
                  onPress={() => handleEditButton(index, item)}>
                  <Image
                    source={require('../assets/images/comment_9131537.png')}
                    style={{
                      width: 25,
                      height: 25,
                      padding: 5,
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{marginRight: 1}}
                  onPress={() => handleCallButton(item.phone, item)}>
                  <Icon
                    source="phone"
                    type="font-awesome"
                    color="#0D6EFD"
                    size={30}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {expandedItem === index && (
              <View
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  margin: 10,
                  marginLeft: 10,
                  backgroundColor: '#f3f3f3',
                  marginBottom: 5,
                  borderRadius: 5,
                }}>
                <View style={{flexDirection: 'row', marginBottom: 5}}>
                  <Text style={{fontSize: 12, color: 'black', width: '20%'}}>
                    Full Name:
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: 'black',
                      fontWeight: 'bold',
                      width: '80%',
                      paddingStart: 10,
                    }}>
                    {item.fullName}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', marginBottom: 5}}></View>
                <View style={{flexDirection: 'row', marginBottom: 5}}>
                  <Text style={{fontSize: 12, color: 'black', width: '20%'}}>
                    Email:
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: 'black',
                      fontWeight: 'bold',
                      width: '80%',
                      paddingStart: 10,
                    }}>
                    {item.emailAddress}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', marginBottom: 5}}>
                  <Text style={{fontSize: 12, color: 'black', width: '20%'}}>
                    Status:
                  </Text>
                  <Text
              style={{
                fontSize: 12,
                color: 'black',
                fontWeight: 'bold',
                width: '70%',
                paddingStart: 10,
              }}>
              {getStatusName(item.status)} 
            </Text>
                </View>
                <View style={{flexDirection: 'row', marginBottom: 5}}>
                  <Text style={{fontSize: 12, color: 'black', width: '20%'}}>
                    Last Update:
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: 'black',
                      fontWeight: 'bold',
                      width: '70%',
                      paddingStart: 10,
                    }}>
                   {formatDateString(item.updatedDate)}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={() => {
          if (!loading && hasMoreLeads) {
            setPageNumber(prevPageNumber => prevPageNumber + 1);
          }
        }}
        onEndReachedThreshold={0.2}
        ListFooterComponent={() => {
          return loading && hasMoreLeads && !searchQuery ? (
            <LoadingIndicator />
          ) : null;
        }}
      />

<ChangeStatus
  contacts={contacts}
  modalVisible={modalVisible}
  setModalVisible={setModalVisible}
  selectedItemIndex={selectedItemIndex}
  selectedLead={selectedLead}
  leadIdForComment={leadIdForComment} 
  setLeadIdForComment={setLeadIdForComment}
/>

    </>
  );
};

export default LeadsList;

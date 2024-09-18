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
  Animated,
  StyleSheet
} from 'react-native';
 import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import {Avatar, Icon, Chip} from 'react-native-paper';
import CallDetectorManager from 'react-native-call-detection';
import {useNavigation} from '@react-navigation/native';
import ChangeStatus from './ChangeStatus';
import {TextInput as NormalInput} from 'react-native';
import {
  getLeads,
  postLeadCall,
 } from '../services/leadService';
import EncryptedStorage from 'react-native-encrypted-storage';
import * as Animatable from 'react-native-animatable';

import CallLogs from 'react-native-call-log';
import {timestampToDateTime} from './utility/stampTimeConverter';
 import {userId} from '../services/userService';

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

const FollowUpList = ({route}) => {
  const navigation = useNavigation();
  const callDetectorRef = useRef(null);
  const [callLogs, setCallLogs] = useState([]);
  const [callStates, setCallStates] = useState([]);
  const [callNumber, setCallNumber] = useState('');
  const [callStartTime, setCallStartTime] = useState(null);
  const [inCall, setInCall] = useState(false);
  const [contacts, setContacts] = useState([]);
   const [selectedLead, setSelectedLead] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [leadIdForComment, setLeadIdForComment] = useState(null);
  const [whatsappModalVisible, setWhatsappModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModalAfterCall, setShowModalAfterCall] = useState(false);
  const [lastAccessDate, setLastAccessDate] = useState(new Date());
  const [selectedStatusId, setSelectedStatusId] = useState(0);
  const [loading, setLoading] = useState(false);

  const [searchInput, setSearchInput] = useState('');
  const [hasMoreLeads, setHasMoreLeads] = useState(true);
  const predefinedMessages = [
    'Hello, I am interested in your services.',
    'Can you provide more information about the courses?',
    'Hi, Sajan this side ',
    'Hello, I am interested in your services.',
    'Can you provide more information about the courses?',
    'Hi, Sajan this side ',
  ];
  const [selectedChip, setSelectedChip] = useState(''); 
  const [showChips, setShowChips] = useState(true);
  const [userData, setUserData] = useState(null);
  const [userPhoneNumber, setUserPhoneNumber] = useState('');
   const chipAnimation = useRef(new Animated.Value(0)).current; 
   const handleScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y;

    if (currentOffset <= 0) {
      // Show chips when pulled down to the top
      setShowChips(true);
    } else {
      // Hide chips when scrolling down
      setShowChips(false);
    }
  };

  const [filterModalVisible, setFilterModalVisible] = useState(false);
const [selectedFilter, setSelectedFilter] = useState(null);
const handleFilterOption = (option) => {
  console.log('Selected filter option:', option);
  setSelectedFilter(option);
  setFilterModalVisible(false);
};

  useEffect(() => {
    if (showChips) {
      // Show animation: fade in and slide up
      Animated.timing(chipAnimation, {
        toValue: 1, // Fully visible
        duration: 300,
        useNativeDriver: true, // Better performance
      }).start();
    } else {
      // Hide animation: fade out and slide down
      Animated.timing(chipAnimation, {
        toValue: 0, // Fully hidden
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showChips]);

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
  const onChipPress = (chip) => {
    setSelectedChip(chip);
   };
 
  const handleSearchButtonPress = async () => {
    setSearchQuery(searchInput);
    setPageNumber(1);
    fetchLeads(selectedStatusId, 1, searchInput);
  };
  useEffect(() => {
    const currentDate = new Date();
    if (currentDate.getDate() !== lastAccessDate.getDate()) {
        setLastAccessDate(currentDate);
    }
  }, []);

  const fetchLeads = async (selectedStatusId, pageNumber, searchQuery) => {
    setLoading(true);
    setRefreshing(true);

    try {
      const currentPageNumber = searchQuery ? 1 : pageNumber;
      const response = await getLeads(
        selectedStatusId,
        currentPageNumber,
        searchQuery,
        10,
      );

 
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
              const matchingLogs = logs.filter(
                log => log.phoneNumber === phoneNumber,
              );

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
        animationIn="slideInUp"
        animationOut="slideOutDown"
      transparent={true}
      isVisible={whatsappModalVisible} onBackdropPress={() => setFilterModalVisible(false)}
        onSwipeComplete={() => setFilterModalVisible(false)}
        swipeDirection={['down']}
        style={{
          justifyContent: 'flex-end',
          margin: 0,
          height: '50%',
        }}>
         <View
          style={{
            backgroundColor: '#fff',
            padding: 20,
            elevation: 4,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
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
                style={styles.cancelButton}
                onPress={() => setWhatsappModalVisible(false)}>
                <Text style={{color: 'white', alignSelf:'center'}}>Cancel</Text>
              </TouchableOpacity>
            </View>
       </Modal>
      <Modal
        animationIn="slideInUp"
        animationOut="slideOutDown"
      transparent={true}
      isVisible={filterModalVisible} onBackdropPress={() => setFilterModalVisible(false)}
        onSwipeComplete={() => setFilterModalVisible(false)}
        swipeDirection={['down']}
        style={{
          justifyContent: 'flex-end',
          margin: 0,
          height: '50%',
        }}>
         <View
          style={{
            backgroundColor: '#fff',
            padding: 20,
            elevation: 4,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
           }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 , color:'black'}}>
            Select Filter:
          </Text>
          <TouchableOpacity
            style={styles.filterOption}
            onPress={() => handleFilterOption('Low')}>
            <Text style={styles.filteText}>Low</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterOption}
            onPress={() => handleFilterOption('Medium')}>
            <Text style={styles.filteText}>Medium</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterOption}
            onPress={() => handleFilterOption('High')}>
            <Text style={styles.filteText}>High</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterOption}
            onPress={() => handleFilterOption('High')}>
            <Text style={styles.filteText}>Upcoming</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterOption}
            onPress={() => handleFilterOption('High')}>
            <Text style={styles.filteText}>Pending</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterOption}
            onPress={() => handleFilterOption('High')}>
            <Text style={styles.filteText}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setFilterModalVisible(false)}>
            <Text style={{ color: 'white',alignSelf:'center' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      
    </Modal>

      {showChips && ( 
        <Animated.View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginVertical: 12,
            opacity: chipAnimation, // Apply animation opacity
            transform: [
              {
                translateY: chipAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0], // Slide up on show
                }),
              },
            ],
          }}>
          <Chip
            mode="flat"
            icon="information"
            selected={selectedChip === 'Pending'}
            onPress={() => onChipPress('Pending')}
            style={{
              marginHorizontal: 5,
              backgroundColor: selectedChip === 'Pending' ? '#cbd2f5' : '#f3f3f3',
            }}
            textStyle={{
              color: selectedChip === 'Pending' ? 'white' : 'gray',
            }}>
            Pending
          </Chip>
          <Chip
            mode="flat"
            icon="calendar-today"
            selected={selectedChip === 'Today'}
            onPress={() => onChipPress('Today')}
            style={{
              marginHorizontal: 5,
              backgroundColor: selectedChip === 'Today' ? '#cbd2f5' : '#f3f3f3',
            }}
            textStyle={{
              color: selectedChip === 'Today' ? 'white' : 'gray',
            }}>
            Today
          </Chip>
          <Chip
            mode="flat"
            icon="eye-arrow-left"
            
            selected={selectedChip === 'Upcoming'}
            onPress={() => onChipPress('Upcoming')}
            style={{
              marginHorizontal: 5,
              backgroundColor: selectedChip === 'Upcoming' ? '#cbd2f5' : '#f3f3f3',
            }}
            textStyle={{
              color: selectedChip === 'Upcoming' ? 'white' : 'gray',
            }}>
            Upcoming
          </Chip>
        </Animated.View>
      )}

      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <NormalInput
          style={{
            width: '70%',
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
        onPress={() => setFilterModalVisible(true)}
        style={{ marginLeft: 15 }}>
        <Icon
          source="filter"
          type="material-community"
          color="#1875f0"
          size={25}
        />
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
                    {item.status}
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
                    10 May
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
        
        onEndReachedThreshold={0.3}
        onScroll={handleScroll}
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
const styles = StyleSheet.create({
  filterOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cancelButton: {
    justifyContent: 'center',
    backgroundColor: '#0D6EFD',
    padding: 8,
    borderRadius: 5,
      marginTop: 15,
    width:"50%",
    alignSelf:'center'
  },
  filteText:{
    fontSize:15,
    fontWeight:'600'
  }
});

export default FollowUpList;

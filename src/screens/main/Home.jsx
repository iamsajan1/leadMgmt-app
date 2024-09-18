import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Linking,
  RefreshControl,
} from 'react-native';
import {LineChart, ProgressChart} from 'react-native-chart-kit';
import EncryptedStorage from 'react-native-encrypted-storage';

import {
  NativeViewGestureHandler,
  ScrollView,
} from 'react-native-gesture-handler';
import SearchBar from '../../components/SearchBar';
import LinearGradient from 'react-native-linear-gradient';
import {Avatar, Button, Card, Icon, List, Text} from 'react-native-paper';
import {showNotification} from './Notification';
import {FlatList} from 'react-native';
import {
   getFollowUpLead,
  postLeadComments,
} from '../../services/leadService';
import {useNavigation} from '@react-navigation/native';
import FollowUpLeads from '../../components/FollowUpLeads';
import ChangeStatus from '../../components/ChangeStatus';
import Leads from './Leads';
import UserReport from './UserReport';
import { fetchNotifications } from '../../components/utility/notificationUtils';
import { DashboardCallSummary } from '../../services/userService';

const Home = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editedValue, setEditedValue] = useState('');
  const [selectedStatusId, setSelectedStatusId] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('New Lead');
  const [showModalAfterCall, setShowModalAfterCall] = useState(false);
  const [lastAccessDate, setLastAccessDate] = useState(new Date());
  const [leadIdForComment, setLeadIdForComment] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [additionalSummaries, setAdditionalSummaries] = useState([]);
  const navigation = useNavigation();
  const [contacts, setContacts] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [colorsReset, setColorsReset] = useState(false);
  const [callLogs, setCallLogs] = useState([]);
  const [hasMoreLeads, setHasMoreLeads] = useState(true);
  const [averageCallDuration, setAverageCallDuration] = useState('');
  const [connectedCalls, setConnectedCalls] = useState('');

  const [totalCalls, setTotalCalls] = useState('');
  const [userData, setUserData] = useState();
  const [totalCallDurationInMins, setTotalCallDurationInMins] = useState('');
  const [expandedItem, setExpandedItem] = useState(null);
  const [inCall, setInCall] = useState(false);
  const [callStates, setCallStates] = useState([]);
  const [callStartTime, setCallStartTime] = useState(null);
  const [callNumber, setCallNumber] = useState('');
  const [whatsappModalVisible, setWhatsappModalVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [shownNotificationIds, setShownNotificationIds] = useState(new Set());
  const [hasMore, setHasMore] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const predefinedMessages = [
    'Hello, I am interested in your services.',
    'Can you provide more information about the courses?',
    'Hi, Sajan this side ',
    'Hello, I am interested in your services.',
    'Can you provide more information about the courses?',
    'Hi, Sajan this side ',
  ];
  const handleWhatsappMessage = message => {
    const whatsappUrl = `whatsapp://send?phone=+91${callNumber}&text=${encodeURIComponent(
      message,
    )}`;
    Linking.openURL(whatsappUrl).catch(err => {});
    setWhatsappModalVisible(false);
  };
  const handleItemPress = index => {
    setExpandedItem(expandedItem === index ? null : index);
  };
  // useEffect(() => {
  //   if (userData && userData.role === 'admin') {
  //     fetchData(); // Fetch data only if the user is an admin
  //   } else {
  //     fetchFollowUpLeads(1, 3); // Fetch follow-up leads if the user is not an admin
  //   }
  // }, [pageNumber]);
  const handleCallButton = async (phoneNumber, leadData) => {
    // console.log('Selected Lead ID:', leadData);
    if (!inCall && phoneNumber) {
      try {
        await Linking.openURL(`tel:${phoneNumber}`);
        // console.log('Call initiated successfully');
        setCallStates([]);
        setCallStartTime(null);
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
  const handleCommentSubmit = async selectedStatus => {
    if (editedValue.trim() === '' || !leadIdForComment) return;

    const data = {
      leadId: leadIdForComment,
      detail: editedValue,
      status: selectedStatus,
    };
    // console.log('Status value to be posted:', selectedStatus);
    try {
      const response = await postLeadComments(data);

      if (response.ok) {
        const responseData = await response.json();
        // console.log('Response Data:', responseData);
        // console.log('Lead status updated successfully:', selectedStatus);
      } else {
        console.error('Error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setModalVisible(false);
      setLeadIdForComment(null);
      setEditedValue('');
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  }, []);
  const fetchData = async () => {
    try {
      const data = await DashboardCallSummary();
      console.log("🚀 ~ fetchData ~ data:", data)

      if (data && data.data) {
        if (Array.isArray(data.data) && data.data.length > 0) {
          const summaryData = data.data[0];
          const additionalSummaries = data.data.slice(0); // Change here to include all data
          // Set the summary data to state
          setAverageCallDuration(
            `${(summaryData.averageCallDuration / 60).toFixed(2)}m`,
          );
          setTotalCalls(summaryData.totalCall.toString());
          setTotalCallDurationInMins(
            Math.floor(summaryData.totalCallDuration / 60).toString(),
          );

          // Set the additional summaries to state
          setAdditionalSummaries(additionalSummaries);
          setConnectedCalls(summaryData.connectedCalls);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    const fetchAndDisplayNotifications = async () => {
      await fetchNotifications(1, shownNotificationIds, setNotifications, setHasMore, setShownNotificationIds);
    };
    fetchAndDisplayNotifications();
    const interval = setInterval(fetchAndDisplayNotifications, 900000);
    return () => clearInterval(interval);
  }, [shownNotificationIds]);

  const formatCallDuration = seconds => {
    const minutes = (seconds / 60).toFixed(2);
    return `${minutes}m`;
  };

  const handleEditButton = (index, leadId) => {
    setSelectedItemIndex(index);
    setEditedValue(contacts[index].fullName);
    setModalVisible(true);
    setLeadIdForComment(leadId);
  };
  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      checkAuthentication();
    }, 60000); // Refresh the greeting every minute
    return () => clearInterval(interval);
  }, []);

  const checkAuthentication = async () => {
    try {
      const storedUser = await EncryptedStorage.getItem('user_session');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUserData(userData);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
    }
  };

  const getGreetingMessage = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return 'Good morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  };
  const handleWhatsApp = phoneNumber => {
    let formattedPhoneNumber = phoneNumber;
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

  const fetchFollowUpLeads = async (pageNumber, searchQuery) => {
    setRefreshing(true);
    try {
      const response = await getFollowUpLead(pageNumber, searchQuery, 5);

      // console.log('API Response:', response);

      if (response && response.data) {
        const responseData = response.data;
        const apiLeads = responseData.items || [];
        const totalLeads = responseData.totalCount || 0;

        // console.log('Total number of leads:', totalLeads);

        if (pageNumber === 1) {
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

        if ((pageNumber - 1) * 10 + apiLeads.length >= totalLeads) {
          setHasMoreLeads(false);
        } else {
          setHasMoreLeads(true);
        }
      }
      setRefreshing(false);
    } catch (error) {
      console.error('Error loading Lead: ', error);
      setRefreshing(false);
    }
  };

  // const onRefresh = () => {
  //   setRefreshing(true);
  //   setPageNumber(1);
  //   setContacts([]);
  //   fetchFollowUpLeads(1, 3);
  //   setRefreshing(false);
  // };

  useEffect(() => {
    fetchFollowUpLeads(1, 3);
  }, [pageNumber]);
  useEffect(() => {
    if (userData && userData.role === 'admin') {
      fetchData(); // Fetch data only if the user is an admin
    } else {
      fetchFollowUpLeads(1, 3); // Fetch follow-up leads if the user is not an admin
    }
  }, [pageNumber]);

  const cardData = getCardData(); // Define cardData based on user role

  function getCardData() {
    if (userData && userData.roleName !== 'Admin') {
      return [
        {
          title: 'Total Calls',
          iconColor: 'white',
          count: totalCalls,
          iconName: 'chart-timeline-variant',
          bgColor: ['#f7df05', '#f2d26f'],
        },
        {
          title: 'Avg Call Duration',
          iconColor: 'white',
          count: averageCallDuration.toString(),
          iconName: 'elevation-rise',
          bgColor: ['#fc1912', '#ed8179'],
        },
        {
          title: 'Total call duration',
          iconColor: 'white',
          count: totalCallDurationInMins + 'm',
          iconName: 'layers-triple',
          bgColor: ['#035e85', '#4b7e94'],
        },
        {
          title: 'Connected call',
          iconColor: 'white',
          count: connectedCalls,
          iconName: 'wall',
          bgColor: ['#07f21b', '#51f55f'],
        },
        {
          title: 'Meeting',
          iconColor: 'white',
          count: '100',
          iconName: 'video-outline',
          bgColor: ['#160ffa', '#645ffa'],
        },
        {
          title: 'Calendars',
          iconColor: 'white',
          count: '100',
          iconName: 'calendar',
          bgColor: ['#12a6c7', '#5198a8'],
        },
      ];
    } else {
      // Return an array with only the cards meant for non-admin users
      return [
        // {
        //   title: 'Forgotten',
        //   iconColor: 'white',
        //   count: '100',
        //   iconName: 'wall',
        //   bgColor: ['#07f21b', '#51f55f'],
        // },
        // {
        //   title: 'Meeting',
        //   iconColor: 'white',
        //   count: '100',
        //   iconName: 'video-outline',
        //   bgColor: ['#160ffa', '#645ffa'],
        // },
        // {
        //   title: 'Calendars',
        //   iconColor: 'white',
        //   count: '100',
        //   iconName: 'calendar',
        //   bgColor: ['#12a6c7', '#5198a8'],
        // },
      ];
    }
  }

  const cardStatsData = [
    {stats: '25.6%', title: 'Akib Mansuri'},
    {stats: '78%', title: 'Faruk Khan'},
    {stats: '62%', title: 'Akash Yadav'},
    {stats: '55%', title: 'Vikas Kumar'},
  ];
  const chartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fefefe',
    backgroundGradientTo: '#fff',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(30, 144, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#34a8eb',
    },
  };
  const screenWidth = Dimensions.get('window').width;
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        strokeWidth: 2, // optional
      },
    ],
    legend: ['Rainy Days'], // optional
  };
  const progressData = {
    labels: ['Swim', 'Bike', 'Run'], // optional
    data: [0.4, 0.6, 0.8],
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <NativeViewGestureHandler>
        <View>
          <View style={styles.container}>
            <View style={styles.userSection}>
              <View style={styles.userInfo}>
                <TouchableOpacity
                  onPress={() => showNotification('hello', 'message')}>
                  <Text style={styles.greetingSubText}>
                    {getGreetingMessage()} !{' '}
                  </Text>
                </TouchableOpacity>
                {userData && (
                  <TouchableOpacity>
                    <Text style={styles.greetingText}>
                      {userData.fullName.length > 20
                        ? userData.fullName.substring(0, 15) + '...'
                        : userData.fullName}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View style={styles.searchBarContainer}>
              <SearchBar />
            </View>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                borderBottomLeftRadius: 5,
              }}>
              {cardData.map((card) => (
  <Card
    key={card.id} // Ensure each card has a unique `id`
    style={{
      width: '48%',
      margin: '1%',
      padding: 0,
    }}>
    <LinearGradient
      colors={card.bgColor || ['#FFFFFF', '#FFFFFF']} // Use default colors if bgColor is not provided
      style={{
        flex: 1,
        borderRadius: 4,
        padding: 4,
      }}>
      <Card.Content>
        <Text style={{color: 'white'}}>{card.title}</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: 'white',
            }}>
            {card.count}
          </Text>
          <Icon
            source={card.iconName}
            color={card.iconColor}
            size={20}
          />
        </View>
      </Card.Content>
    </LinearGradient>
  </Card>
))}

            </View>
            {additionalSummaries.length > 0 &&
              userData.roleName === 'Admin' && (
                <View style={{marginVertical: 12}}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      marginBottom: 12,
                    }}>
                    Additional Call Summaries
                  </Text>
                  <View style={{backgroundColor: '#f3f3f3', borderRadius: 8}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        borderBottomWidth: 1,
                        borderBottomColor: 'gray',
                        paddingVertical: 8,
                      }}>
                      <Text
                        style={{
                          flex: 1,
                          fontWeight: 'bold',
                          color: 'gray',
                          textAlign: 'center',
                        }}>
                        Name
                      </Text>
                      <Text
                        style={{
                          flex: 1,
                          fontWeight: 'bold',
                          color: 'gray',
                          textAlign: 'center',
                        }}>
                        Total
                      </Text>
                      <Text
                        style={{
                          flex: 1,
                          fontWeight: 'bold',
                          color: 'gray',
                          textAlign: 'center',
                        }}>
                        Conn.
                      </Text>
                      <Text
                        style={{
                          flex: 1,
                          fontWeight: 'bold',
                          color: 'gray',
                          textAlign: 'center',
                        }}>
                        Dur.
                      </Text>
                      <Text
                        style={{
                          flex: 1.5,
                          fontWeight: 'bold',
                          color: 'gray',
                          textAlign: 'center',
                        }}>
                        Avg.
                      </Text>
                    </View>

                    {additionalSummaries.map((summary, index) => (
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('UserReport', {
                            userId: summary.id,
                            startDate: 'start-date',
                            endDate: 'end-date',
                          });
                        }}>
                        <View
                           keyExtractor={(item, index) => index.toString()}
                          style={{
                            flexDirection: 'row',
                            borderBottomWidth: 1,
                            borderBottomColor: 'gray',
                            paddingVertical: 8,
                          }}>
                          <Text
                            style={{
                              flex: 1.5,
                              color: 'gray',
                              textAlign: 'center',
                            }}>
                            {summary.name}
                          </Text>
                          <Text
                            style={{
                              flex: 1,
                              color: 'gray',
                              textAlign: 'center',
                            }}>
                            {summary.totalCall}
                          </Text>
                          <Text
                            style={{
                              flex: 1,
                              color: 'gray',
                              textAlign: 'center',
                            }}>
                            {summary.connectedCalls}
                          </Text>
                          <Text
                            style={{
                              flex: 2,
                              color: 'gray',
                              textAlign: 'center',
                            }}>
                            {formatCallDuration(summary.totalCallDuration)}
                          </Text>
                          <Text
                            style={{
                              flex: 1.5,
                              color: 'gray',
                              textAlign: 'center',
                            }}>
                            {formatCallDuration(summary.averageCallDuration)}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            <View style={styles.notificationItem}>
              <View>
                <Text
                  style={{color: '#565656', fontSize: 18, fontWeight: 'bold'}}>
                  Statistics Card
                </Text>
                <Text style={{color: 'grey'}}>
                  {' '}
                  Total 48.5% growth this month
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 15,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Avatar.Icon
                    style={{backgroundColor: '#1976d2', marginRight: 8}}
                    size={35}
                    icon="chart-timeline-variant"
                  />
                  <View>
                    <Text style={{color: '#565656'}}>
                      Monthly Call Duration
                    </Text>
                    <Text style={{color: 'grey'}}>245k</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Avatar.Icon
                    style={{backgroundColor: '#2e7d32', marginRight: 8}}
                    size={35}
                    icon="chart-timeline-variant"
                  />
                  <View>
                    <Text style={{color: '#565656'}}>Revenue</Text>
                    <Text style={{color: 'grey'}}>245k</Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 15,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Avatar.Icon
                    style={{backgroundColor: '#ed6c02', marginRight: 8}}
                    size={35}
                    icon="chart-timeline-variant"
                  />
                  <View>
                    <Text style={{color: '#565656'}}>Customers</Text>
                    <Text style={{color: 'grey'}}>12.5k</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Avatar.Icon
                    style={{backgroundColor: '#2a79fa', marginRight: 8}}
                    size={35}
                    icon="chart-timeline-variant"
                  />
                  <View>
                    <Text style={{color: '#565656'}}>Product</Text>
                    <Text style={{color: 'grey'}}>1.5k</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.notificationItem}>
              <Text style={styles.notificationTitle}>Notifications</Text>
              <View>
                <Text style={styles.notificationText}>Notification 1</Text>
              </View>
              <View>
                <Text style={styles.notificationText}>Notification 2</Text>
              </View>
              <View>
                <Text style={styles.notificationText}>Notification 3</Text>
              </View>
            </View>
            <View>
              <View
                style={{
                  marginLeft: 0,
                  backgroundColor: '#ffff',
                  paddingLeft: 10,
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                }}>
                <Text style={styles.notificationTitle}>Follow Up Leads</Text>
              </View>
              <FlatList
                data={contacts}
                // refreshControl={
                //   <RefreshControl
                //     refreshing={refreshing}
                //     onRefresh={onRefresh}
                // //   />
                // }
                renderItem={({item, index}) => (
                  <View>
                    <View
                      style={{
                        backgroundColor: '#fff',
                        paddingBottom: 10,
                        borderBottomLeftRadius: 8,
                        borderBottomRightRadius: 8,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: 4,
                          backgroundColor: '#f3f3f3',
                          borderRadius: 10,
                          marginVertical: 2,
                          marginHorizontal: 8,
                          elevation: 2,
                        }}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <View style={{marginRight: 10}}>
                            <TouchableOpacity
                              onPress={() => handleItemPress(index)}>
                              <Avatar.Text
                                size={55}
                                label={item.fullName.charAt(0)}
                                color="white"
                                style={{backgroundColor: '#0D6EFD'}}
                              />
                            </TouchableOpacity>
                          </View>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('LeadDetail', {
                                leadId: item.id,
                              })
                            }>
                            <View>
                              <Text
                                style={{
                                  fontSize: 14,
                                  fontWeight: 'bold',
                                  color: 'grey',
                                }}>
                                {item.fullName}
                              </Text>
                              <Text style={{color: 'grey'}}>{item.phone}</Text>
                              <Text style={{color: 'grey'}}>
                                {item.courseName}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                          <TouchableOpacity
                            style={{marginRight: 8}}
                            onPress={() => handleWhatsApp(item.phone)}>
                            <Icon
                              source="whatsapp"
                              type="font-awesome"
                              color="#029c0c"
                              size={30}
                            />
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={{marginRight: 8}}
                            onPress={() => handleEditButton(index, item.id)}>
                            <Icon
                              source="comment-plus-outline"
                              type="ionicon"
                              color="grey"
                              size={30}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{marginRight: 8}}
                            onPress={() => handleCallButton(item.phone, item)}>
                            <Icon
                              source="phone"
                              type="font-awesome"
                              color="grey"
                              size={30}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                    {expandedItem === index && (
                      <View
                        style={{
                          paddingHorizontal: 20,
                          paddingVertical: 10,
                          margin: 10,
                          marginLeft: 30,
                        }}>
                        <View style={{flexDirection: 'row', marginBottom: 5}}>
                          <Text
                            style={{
                              fontSize: 12,
                              color: 'black',
                              width: '30%',
                            }}>
                            Full Name:
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,
                              color: 'black',
                              fontWeight: 'bold',
                              width: '70%',
                              paddingStart: 10,
                            }}>
                            {item.fullName}
                          </Text>
                        </View>
                        <View style={{flexDirection: 'row', marginBottom: 5}}>
                          <Text
                            style={{
                              fontSize: 12,
                              color: 'black',
                              width: '30%',
                            }}>
                            Distict:
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,
                              color: 'black',
                              fontWeight: 'bold',
                              width: '70%',
                              paddingStart: 10,
                            }}>
                            {item.distictName}
                          </Text>
                        </View>
                        <View style={{flexDirection: 'row', marginBottom: 5}}>
                          <Text
                            style={{
                              fontSize: 12,
                              color: 'black',
                              width: '30%',
                            }}>
                            Email:
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,
                              color: 'black',
                              fontWeight: 'bold',
                              width: '70%',
                              paddingStart: 10,
                            }}>
                            {item.emailAddress}
                          </Text>
                        </View>
                        <View style={{flexDirection: 'row', marginBottom: 5}}>
                          <Text
                            style={{
                              fontSize: 12,
                              color: 'black',
                              width: '30%',
                            }}>
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
                          <Text
                            style={{
                              fontSize: 12,
                              color: 'black',
                              width: '30%',
                            }}>
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
              />
              <ChangeStatus
                contacts={contacts}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                setEditedValue={setEditedValue}
                selectedItemIndex={contacts.selectedItemIndex}
                setSelectedStatus={setSelectedStatus}
                leadIdForComment={leadIdForComment}
                handleClearText={() => setEditedValue('')}
                closeModal={() => setModalVisible(false)}
                handleCommentSubmit={handleCommentSubmit}></ChangeStatus>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("FollowUpLeads")}>
              <Text style={styles.seeMoreButton}> See More</Text>
            </TouchableOpacity>
            <View style={[styles.chartContainer]}>
              <View style={[styles.marginY25]}>
                <Text
                  variant="titleLarge"
                  style={[styles.notificationTitle, styles.ChatTitle]}>
                  Monthly LineChart
                </Text>
                <LineChart
                  data={data}
                  width={screenWidth}
                  height={220}
                  yAxisLabel="$"
                  yAxisSuffix="k"
                  yAxisInterval={1}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.lineChart}
                />
              </View>
              <View style={[styles.marginY25]}>
                <Text
                  variant="titleLarge"
                  style={[styles.notificationTitle, styles.ChatTitle]}>
                  Performance chart
                </Text>
                <ProgressChart
                  data={progressData}
                  width={screenWidth}
                  height={220}
                  strokeWidth={16}
                  radius={32}
                  chartConfig={chartConfig}
                  hideLegend={false}
                />
              </View>
            </View>
          </View>
        </View>
      </NativeViewGestureHandler>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headingContainer: {
    marginBottom: 0,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  dFlex: {
    display: 'flex',
  },
  fullWidth: {
    width: '100%',
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  justifyContentFlexEnd: {
    justifyContent: 'flex-end',
  },
  justifyContentFlexStart: {
    justifyContent: 'flex-start',
  },
  justifyContentSpaceAround: {
    justifyContent: 'space-around',
  },
  justifyContentSpaceBetween: {
    justifyContent: 'space-between',
  },
  justifyContentSpaceEvenly: {
    justifyContent: 'space-evenly',
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexColumn: {
    flexDirection: 'column',
  },
  cardButton: {
    width: '100%',
    borderWidth: 0,
  },
  textHighlight: {
    fontSize: 17,
    marginTop: 15,
  },
  ChatTitle: {
    backgroundColor: '#FFFFFF',
    marginBottom: 0,
    paddingLeft: 9,
    width: '110%',
    borderTopLeftRadius: 5,
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    fontFamily: 'poppins',
    width: '100%',
  },
  bgPrimary: {
    backgroundColor: '#eaf6fd',
  },
  container: {
    backgroundColor: '#f3f3f3',
    fontFamily: 'poppins',
    paddingHorizontal: '4%',
  },
  textAlignCenter: {
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 15,
  },
  bellIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  menuIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  menu: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: 'white',
    elevation: 5,
    zIndex: 2,
    borderRadius: 5,
  },
  menuItem: {
    padding: 10,
    fontSize: 16,
    color: 'grey',
  },
  marginY25: {
    marginVertical: 3,
  },
  userSection: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  searchBarContainer: {
    marginVertical: 5,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  userInfo: {
    flexDirection: 'row',
    margin: 10,
  },
  greatingText: {
    fontSize: 22,
    fontFamily: 'poppins',
    fontWeight: '300',
    color: 'grey',
  },
  greetingText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black',
  },
  cardText: {
    fontSize: 20,
    fontFamily: 'poppins',
    fontWeight: '300',
  },
  cardSubText: {
    fontSize: 15,
    fontFamily: 'poppins',
    fontWeight: '300',
    color: 'grey',
  },
  greatingSubText: {
    fontSize: 22,
    fontFamily: 'poppins',
    fontWeight: 'bold',
    color: '#565656',
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  gridItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fefefe',
    borderRadius: 10,
    margin: 5,
  },
  total: {
    fontSize: 20,
    color: 'grey',
  },
  active: {
    fontSize: 20,
    color: 'grey',
  },
  closed: {
    fontSize: 20,
    color: 'grey',
  },
  notificationContainer: {
    backgroundColor: '#ffff',
    borderRadius: 10,
    padding: 10,
  },
  notificationTitle: {
    fontSize: 18,
    color: '#565656',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  notificationItem: {
    backgroundColor: '#fefefe',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    elevation: 5,
    shadowColor: 'grey',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: 5,
  },
  greetingSubText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'gray',
  },
  notificationText: {
    fontSize: 16,
    color: 'grey',
    padding: 6,
  },
  seeMoreButton: {
    fontWeight: 'bold',
    alignSelf: 'flex-end',
    marginRight: '5%',
    color: 'blue',
    margin: 10,
  },
});
export default Home;

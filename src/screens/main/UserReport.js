import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {Avatar, Card, Icon} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import {getUserReport} from '../../services/userService';
import HeaderWithBackButton from '../../components/HeaderWithBackButton';
import { DashboardCallSummary } from '../../services/leadService';
import DateRangeSector from '../../components/utility/DateRangeSelector';
 
const UserReport = ({ route }) => {
  const { userId } = route.params || {};

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateError, setDateError] = useState('');
  const [additionalSummaries, setAdditionalSummaries] = useState([]);
  const [scrollY] = useState(new Animated.Value(0));
  const [averageCallDuration, setAverageCallDuration] = useState('');
  const [connectedCalls, setConnectedCalls] = useState('');
  const [totalCalls, setTotalCalls] = useState('');
  const [totalCallDurationInMins, setTotalCallDurationInMins] = useState('');
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;

        if (startDate && endDate) {
          const startDateISO = startDate.toISOString();
          const endDateISO = endDate.toISOString();
          response = await getUserReport(userId, startDateISO, endDateISO);
        } else if (!startDate && !endDate) {
          response = await getUserReport(userId, null, null);
        } else {
          return;
        }

        console.log('User Data:', response);

        if (response && response.data && response.data.data) {
          setData(response.data);
        } else {
          console.warn('Data format is not as expected:', response);
          setData(null);
        }
      } catch (error) {
        setError(error.message || 'An unknown error occurred');
        console.error('Error fetching user data:', error);
      }
    };

    if (!dateError) {
      fetchData();
    }
  }, [userId, startDate, endDate, dateError]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await DashboardCallSummary();

      if (data && data.data) {
        if (Array.isArray(data.data) && data.data.length > 0) {
          const summaryData = data.data[0];
          const additionalSummaries = data.data.slice(0);
          setAverageCallDuration(
            `${(summaryData.averageCallDuration / 60).toFixed(2)}m`,
          );
          setTotalCalls(summaryData.totalCall.toString());
          setTotalCallDurationInMins(
            Math.floor(summaryData.totalCallDuration / 60).toString(),
          );
          setAdditionalSummaries(additionalSummaries);
          setConnectedCalls(summaryData.connectedCalls);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDateRangeChange = (startDate, endDate) => {
    if (endDate && startDate && endDate < startDate) {
      setDateError('End date cannot be before the start date.');
    } else if (endDate && endDate > new Date()) {
      setDateError('End date cannot be in the future.');
    } else {
      setDateError('');
      setStartDate(startDate);
      setEndDate(endDate);
      setShowDateRangePicker(false); // Close the date range picker
    }
  };

  const formatCallDuration = seconds => {
    const minutes = (seconds / 60).toFixed(2);
    return `${minutes}m`;
  };

  return (
    <>
      <HeaderWithBackButton headerText={'Counsellor Report'} />
      <LinearGradient colors={['#f0f2f5', '#ffffff']} style={styles.container}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <ScrollView>
            <View style={styles.headerContainer}>
              <Card elevation={10} style={styles.headerCard}>
                <LinearGradient
                  colors={['#4a90e2', '#1c5fab']}
                  style={styles.headerBackground}>
                  <View style={styles.profileContainer}>
                    <Avatar.Text
                      size={100}
                      label={data?.name[0]?.toUpperCase() || 'U'}
                      style={styles.avatar}
                    />
                    <View style={styles.textContainer}>
                      <Text style={styles.counselorName}>
                        {data?.name || 'No Name'}
                      </Text>
                      <Text style={styles.leadSummary}>
                        Total Leads: {data?.totalLead || 'N/A'}
                      </Text>
                      <Text style={styles.leadSummary}>
                        Active Leads: {data?.activeLead || 'N/A'}
                      </Text>
                      <Text style={styles.leadSummary}>
                        Inactive Leads: {data?.inActiveLead || 'N/A'}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </Card>
            </View>

            <View style={styles.datePickerContainer}>
              <TouchableOpacity
                onPress={() => setShowDateRangePicker(true)}
                style={styles.datePickerButton}>
                <Icon source="calendar" size={24} color="#4a90e2" />
                <Text style={styles.datePickerText}>
                  {startDate && endDate
                    ? `${startDate.toDateString()} - ${endDate.toDateString()}`
                    : 'Select Date Range'}
                </Text>
              </TouchableOpacity>
              {showDateRangePicker && (
                <DateRangeSector
                  startDate={startDate}
                  endDate={endDate}
                  onDateRangeChange={handleDateRangeChange}
                />
              )}
            </View>

            {additionalSummaries.length > 0 && (
              <View style={styles.statusContainer}>
                <Text style={styles.statusTitle}>Call Report</Text>
                <View style={{ backgroundColor: '#ffff', borderRadius: 8 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      borderBottomWidth: 1,
                      borderBottomColor: '#ffff',
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
                    <TouchableOpacity key={index}>
                      <View
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

            <View style={styles.statusContainer}>
              <Text style={styles.statusTitle}>Counsellor Summary</Text>
              <View style={styles.cardContainer}>
                {data?.data?.newLead && (
                  <AnimatedStatusCard
                    statusKey="newLead"
                    value={data.data?.newLead}
                  />
                )}
                {data?.data?.prospect && (
                  <AnimatedStatusCard
                    statusKey="prospect"
                    value={data.data?.prospect}
                  />
                )}
                {data?.data?.warmLead && (
                  <AnimatedStatusCard
                    statusKey="warmLead"
                    value={data.data?.warmLead}
                  />
                )}
                {data?.data?.coldLead && (
                  <AnimatedStatusCard
                    statusKey="coldLead"
                    value={data.data?.coldLead}
                  />
                )}
                {data?.data?.hotLead && (
                  <AnimatedStatusCard
                    statusKey="hotLead"
                    value={data.data?.hotLead}
                  />
                )}
                {data?.data?.attemptingToContact && (
                  <AnimatedStatusCard
                    statusKey="Contacting"
                    value={data.data?.attemptingToContact}
                  />
                )}
                {data?.data?.droppedOrNotInterested && (
                  <AnimatedStatusCard
                    statusKey="NotInterested"
                    value={data.data?.droppedOrNotInterested}
                  />
                )}
                {data?.data?.invalidJunk && (
                  <AnimatedStatusCard
                    statusKey="invalidJunk"
                    value={data.data?.invalidJunk}
                  />
                )}
                {data?.data?.followUpForNextSession && (
                  <AnimatedStatusCard
                    statusKey="NextSession"
                    value={data.data?.followUpForNextSession}
                  />
                )}
                {data?.data?.submitted && (
                  <AnimatedStatusCard
                    statusKey="submitted"
                    value={data.data?.submitted}
                  />
                )}
                {data?.data?.closedLost && (
                  <AnimatedStatusCard
                    statusKey="closedLost"
                    value={data.data?.closedLost}
                  />
                )}
                {data?.data?.notReachable && (
                  <AnimatedStatusCard
                    statusKey="notReachable"
                    value={data.data?.notReachable}
                  />
                )}
                {data?.data?.callBackAndFollowup && (
                  <AnimatedStatusCard
                    statusKey="followUp"
                    value={data.data?.callBackAndFollowup}
                  />
                )}
                {data?.data?.rejected && (
                  <AnimatedStatusCard
                    statusKey="rejected"
                    value={data.data?.rejected}
                  />
                )}
                {data?.data?.languageBarrier && (
                  <AnimatedStatusCard
                    statusKey="languageBarrier"
                    value={data.data?.languageBarrier}
                  />
                )}
                {data?.data?.notEligible && (
                  <AnimatedStatusCard
                    statusKey="notEligible"
                    value={data.data?.notEligible}
                  />
                )}
                {data?.data?.enrolled && (
                  <AnimatedStatusCard
                    statusKey="enrolled"
                    value={data.data?.enrolled}
                  />
                )}
              </View>
            </View>
          </ScrollView>
        )}
      </LinearGradient>
    </>
  );
};
// Animated status card component
const AnimatedStatusCard = ({statusKey, value}) => {
  const animation = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const animatedStyle = {
    opacity: animation,
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.95, 1],
        }),
      },
    ],
  };

  return (
    <Animated.View style={[styles.statusCard, animatedStyle]}>
      <LinearGradient
        colors={getGradientColors(statusKey)}
        style={styles.gradient}>
        <View style={styles.iconContainer}>
          <Icon name={getIconName(statusKey)} size={30} color="#fff" />
        </View>
        <Text style={styles.statusLabel}>{formatKey(statusKey)}</Text>
        <Text style={styles.statusValue}>{value}</Text>
      </LinearGradient>
    </Animated.View>
  );
};

// Helper functions for icons, formatting, and gradients
const getIconName = key => {
  switch (key) {
    case 'newLead':
      return 'star';
    case 'prospect':
      return 'user';
    case 'warmLead':
      return 'fire';
    case 'coldLead':
      return 'snowflake-o';
    case 'hotLead':
      return 'bolt';
    case 'Contacting':
      return 'phone';
    case 'NotInterested':
      return 'thumbs-down';
    case 'invalidJunk':
      return 'trash';
    case 'NextSession':
      return 'calendar';
    case 'submitted':
      return 'upload';
    case 'closedLost':
      return 'times';
    case 'notReachable':
      return 'exclamation-triangle';
    case 'followUp':
      return 'clock-o';
    case 'rejected':
      return 'ban';
    case 'languageBarrier':
      return 'language';
    case 'notEligible':
      return 'ban';
    case 'enrolled':
      return 'check';
    default:
      return 'question';
  }
};

const formatKey = key => {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};

const getGradientColors = key => {
  switch (key) {
    case 'newLead':
      return ['#e74c3c', '#c0392b'];
    case 'prospect':
      return ['#3498db', '#2980b9'];
    case 'warmLead':
      return ['#f39c12', '#e67e22'];
    case 'coldLead':
      return ['#95a5a6', '#7f8c8d'];
    case 'hotLead':
      return ['#2ecc71', '#27ae60'];
    case 'Contacting':
      return ['#9b59b6', '#8e44ad']; // Purple gradient
    case 'NotInterested':
      return ['#e67e22', '#d35400']; // Deep Orange gradient
    case 'invalidJunk':
      return ['#7f8c8d', '#95a5a6']; // Dark Gray gradient
    case 'NextSession':
      return ['#1abc9c', '#16a085']; // Turquoise gradient
    case 'submitted':
      return ['#2c3e50', '#34495e']; // Dark Blue gradient
    case 'closedLost':
      return ['#c0392b', '#e74c3c']; // Crimson gradient
    case 'notReachable':
      return ['#16a085', '#1abc9c']; // Emerald gradient
    case 'followUp':
      return ['#f1c40f', '#f39c12']; // Yellow gradient
    case 'rejected':
      return ['#e74c3c', '#c0392b']; // Red gradient
    case 'languageBarrier':
      return ['#8e44ad', '#9b59b6']; // Amethyst gradient
    case 'notEligible':
      return ['#d35400', '#e67e22']; // Carrot gradient
    case 'enrolled':
      return ['#27ae60', '#2ecc71']; // Nephritis gradient
    default:
      return ['#34495e', '#2c3e50']; // Wet Asphalt gradient
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
   },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  headerContainer: {
    marginBottom: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  headerCard: {
    width: '90%',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  headerBackground: {
    padding: 10,
    borderRadius: 16,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#fff',
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
  },
  counselorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  leadSummary: {
    fontSize: 14,
    color: '#f0f0f0',
    marginBottom: 1,
  },
  datePickerContainer: {
    margin: 10,
  },
  datePickerButton: {
    padding: 10,
    backgroundColor: '#fefefe',
    borderRadius: 20,
    marginVertical: 5,
    borderWidth: 0.1,
  },
  datePickerText: {
    fontSize: 16,
  },
  statusContainer: {
    padding: 16,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statusCard: {
    width: '48%',
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  gradient: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 10,
  },
  statusLabel: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statusValue: {
    fontSize: 18,
    color: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default UserReport;

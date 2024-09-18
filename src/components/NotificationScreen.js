import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import {Icon} from 'react-native-paper';
import Modal from 'react-native-modal';
import {useNavigation} from '@react-navigation/native';
import {
  Notifications,
  postNotificationsStatus,
} from '../services/notificationService';
import {showNotification} from '../screens/main/Notification';

const NotificationScreen = () => {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); 
  const [loadingMore, setLoadingMore] = useState(false); 
  const [shownNotificationIds, setShownNotificationIds] = useState(new Set());
  const navigation = useNavigation();

  const fetchNotifications = async (page = 1) => {
    try {
      const data = await Notifications(page, 10);
      if (data.status && data.status.type === 'success') {
        const newNotifications = data.data.items;
        console.log('Fetched Notifications:', newNotifications);
        const uniqueNotifications = [];
        const seenIds = new Set();
        newNotifications.forEach(notification => {
          if (!seenIds.has(notification.id)) {
            seenIds.add(notification.id);
            uniqueNotifications.push(notification);
          }
        });
        console.log('Unique Notifications:', uniqueNotifications);  
        const filteredNotifications = uniqueNotifications.filter(
          notification => !shownNotificationIds.has(notification.id),
        );
  
        const newShownIds = new Set(shownNotificationIds);
        filteredNotifications.forEach(notification =>
          newShownIds.add(notification.id),
        );
        setShownNotificationIds(newShownIds);
  
        setNotifications(prevNotifications => [
          ...prevNotifications,
          ...filteredNotifications,
        ]);
  
        filteredNotifications.forEach(notification => {
          if (!notification.isRead) {
            showNotification(
              notification.title || 'New Notification',
              notification.message,
            );
          }
        });
        setHasMore(newNotifications.length > 0);
      } else {
        console.error('Error fetching notifications:', data.status.message);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setRefreshing(false);
      setLoadingMore(false);
    }
  };
  

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    setNotifications([]);
    fetchNotifications(1);
  }, []);

  const loadMoreNotifications = useCallback(() => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      setPage(prevPage => {
        const nextPage = prevPage + 1;
        fetchNotifications(nextPage);
        return nextPage;
      });
    }
  }, [loadingMore, hasMore]);

  const markAsRead = async (notificationId) => {
    try {
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === notificationId ? { ...notification, isRead: true } : notification
        )
      );
      const response = await postNotificationsStatus({ id: notificationId, isRead: true });
    } catch (error) {
      console.error('Error marking notification as read:', error.message || 'Unknown Error');
    }
  };

  useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 900000);
    return () => clearInterval(intervalId);
  }, []);

  const handleNotificationClick = async notification => {
    await markAsRead(notification.id);
  };

  const renderNotificationItem = ({item}) => (
    <View
      style={[
        styles.notificationItem,
        item.isRead
          ? styles.notificationItemRead
          : styles.notificationItemUnread,
      ]}
      key={item.id}>
      <TouchableOpacity
        onPress={() => handleNotificationClick(item)}
        style={styles.notificationContent}>
        <Text style={item.isRead ? styles.textRead : styles.textUnread}>
          {item.message}
        </Text>
        <Text style={styles.dateText}>{item.createdDate}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setSelectedNotification(item);
        }}
        style={styles.iconContainer}>
        <Icon source="dots-horizontal" size={25} color="grey" />
      </TouchableOpacity>
    </View>
  );

  const resetModal = () => {
    setSelectedNotification(null);
  };

  const handleModalAction = async action => {
    if (action === 'read') {
      if (selectedNotification) {
        await markAsRead(selectedNotification.id);
      }
    } else if (action === 'delete') {
      console.log('Delete action');
    } else if (action === 'turnOff') {
      console.log('Turn Off action');
    } else if (action === 'report') {
      console.log('Report action');
    }
    resetModal();
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', marginBottom: 12, marginTop: 12}}>
        <TouchableOpacity onPress={() => navigation.navigate('TabNavigator')}>
          <Icon source="keyboard-backspace" size={25} color="grey" />
        </TouchableOpacity>
        <Text
          style={{
            color: '#565656',
            fontWeight: 'bold',
            fontSize: 20,
            marginLeft: 9,
          }}>
          Notifications
        </Text>
      </View>
      <FlatList
        data={notifications}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false} 
        renderItem={renderNotificationItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMoreNotifications}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <ActivityIndicator size="large" color="#0000ff" /> : null}
      />

      <Modal
        isVisible={!!selectedNotification}
        onBackdropPress={resetModal}
        onSwipeComplete={resetModal}
        swipeDirection={['down']}
        style={styles.bottomModal}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={() => handleModalAction('delete')}>
            <View style={styles.modalIcon}>
              <Icon source="delete-alert" size={18} />
            </View>
            <Text style={styles.modalOption}>Delete this Notification</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={() => handleModalAction('read')}>
            <View style={styles.modalIcon}>
              <Icon source="account-remove" size={18} />
            </View>
            <Text style={styles.modalOption}>Mark as Read</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={() => handleModalAction('turnOff')}>
            <View style={styles.modalIcon}>
              <Icon source="comment-off" size={18} />
            </View>
            <Text style={styles.modalOption}>
              Turn Off Notification from this lead
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={() => handleModalAction('report')}>
            <View style={styles.modalIcon}>
              <Icon source="bug" size={18} />
            </View>
            <Text style={styles.modalOption}>Report bug to Developer</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 9,
    marginTop: 8,
  },
  notificationItem: {
    padding: 12,
    marginBottom: 5,
    borderRadius: 8,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: 'grey',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  notificationItemRead: {
    backgroundColor: '#ffffff', // Background for read notifications
  },
  notificationItemUnread: {
    backgroundColor: '#e0e0e0', // Background for unread notifications
  },
  notificationContent: {
    flex: 1,
  },
  iconContainer: {
    padding: 5,
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  dateText: {
    marginTop: 3,
    color: 'grey',
  },
  textRead: {
    color: 'grey', // Text color for read notifications
  },
  textUnread: {
    color: '#000000', // Text color for unread notifications
    fontWeight: 'bold', // Make text bold for unread notifications
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 50,
  },
  modalOption: {
    fontSize: 15,
    marginBottom: 25,
    color: 'grey',
    marginRight: 15,
  },
  modalIcon: {
    marginRight: 15,
    backgroundColor: '#ccc',
    padding: 6,
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NotificationScreen;

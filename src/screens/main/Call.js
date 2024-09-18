import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Linking, RefreshControl, Image, Modal } from 'react-native';
import FastImage from 'react-native-fast-image';
import { LeadCall } from '../../services/leadService';
import { Icon } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import CallsFilterModal from '../../components/utility/CallsFiltermodal';
 
const loadingGif = require('../../assets/images/loading.gif');

const LoadingIndicator = () => (
  <View style={styles.loadingContainer}>
    <FastImage
      source={loadingGif}
      style={styles.loadingImage}
      resizeMode={FastImage.resizeMode.contain}
    />
  </View>
);

const Call = () => {
  const [leadsData, setLeadsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noMoreData, setNoMoreData] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

  useEffect(() => {
    fetchData();
  }, [pageNumber, selectedUserId, dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await LeadCall(
        pageNumber,
        '',
        10,
        selectedUserId,
        dateRange.startDate || null,
        dateRange.endDate || null
      );
      const newData = response.data.items;
      if (newData.length > 0) {
        setLeadsData(prevData => [...prevData, ...newData]);
      } else {
        setNoMoreData(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setLeadsData([]);
    setNoMoreData(false);
    setPageNumber(1);
    setRefreshing(true);
    fetchData();
  };

  const applyFilter = (userId, newDateRange) => {
    setSelectedUserId(userId);
    setDateRange(newDateRange);
    setPageNumber(1);
    setLeadsData([]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.callLogItem}>
      <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.toPhone}`)}>
        <Icon name="phone" size={25} color="blue" />
      </TouchableOpacity>
      <View style={styles.callInfoContainer}>
        <Animatable.View animation="fadeInRight" duration={1000}>
          <View style={styles.callDetails}>
            <Text style={styles.logText}>{formatCallDuration(item.callDuration)}</Text>
            <Text style={styles.logText}>({item.createdByName.length > 10 ? item.createdByName.substring(0, 15) + '...' : item.createdByName})</Text>
          </View>
          <Text style={styles.logText}>{item.callStart}</Text>
        </Animatable.View>
      </View>
      <Animatable.View animation="fadeInRight" duration={1000}>
        <View style={styles.leadInfoContainer}>
          <Text style={styles.leadPhone}>{item.toPhone}</Text>
          <Text style={styles.leadName}>{item.leadName.length > 10 ? item.leadName.substring(0, 10) + '...' : item.leadName}</Text>
        </View>
      </Animatable.View>
    </View>
  );

  const formatCallDuration = seconds => {
    const minutes = (seconds / 60).toFixed(2);
    return `${minutes}m`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setFilterModalVisible(true)}
      >
        <Icon name="filter" size={25} color="black" />
        <Text style={styles.filterText}>Filter</Text>
      </TouchableOpacity>

      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <CallsFilterModal
              applyFilter={applyFilter}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FlatList
        data={leadsData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={() => (
          <View style={styles.footerContainer}>
            {noMoreData ? (
              <View style={styles.noMoreContainer}>
                <Image
                  source={require('../../assets/images/7265556.webp')}
                  style={styles.noMoreImage}
                />
                <Text style={styles.noMoreText}>No more Call Log available</Text>
              </View>
            ) : null}
          </View>
        )}
        onEndReachedThreshold={0.2}
        onEndReached={() => {
          if (!loading && !noMoreData) {
            setPageNumber(prevPageNumber => prevPageNumber + 1);
          }
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {loading && !refreshing && <LoadingIndicator />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  callLogItem: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  callInfoContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  callDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leadInfoContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  leadPhone: {
    color: 'black',
    fontWeight: '600',
  },
  leadName: {
    color: 'black',
    fontWeight: 'bold',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    margin: 10,
  },
  filterText: {
    fontSize: 16,
    marginLeft: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '50%',
  },
  closeButton: {
    alignSelf: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noMoreText: {
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingImage: {
    width: 100,
    height: 100,
  },
  footerContainer: {
    padding: 10,
  },
  noMoreContainer: {
    alignItems: 'center',
  },
  noMoreImage: {
    width: 70,
    height: 70,
  },
});

export default Call;

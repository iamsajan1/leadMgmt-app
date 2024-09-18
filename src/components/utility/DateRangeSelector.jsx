import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const DateRangeSector = ({ onDateRangeChange }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedRange, setSelectedRange] = useState({ startDate: null, endDate: null });

  const handleDayPress = (day) => {
    const { dateString } = day;
    if (!selectedRange.startDate) {
      setSelectedRange({ startDate: dateString, endDate: null });
    } else if (!selectedRange.endDate) {
      setSelectedRange(prevState => ({
        ...prevState,
        endDate: dateString,
      }));
      onDateRangeChange(selectedRange.startDate, dateString);
    } else {
      setSelectedRange({ startDate: dateString, endDate: null });
    }
  };

  const getMarkedDates = () => {
    if (!selectedRange.startDate || !selectedRange.endDate) return {};

    const { startDate, endDate } = selectedRange;
    const markedDates = {};
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      const dateString = currentDate.toISOString().split('T')[0];
      markedDates[dateString] = { color: 'blue', textColor: 'white' };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
      ...markedDates,
      [startDate]: { startingDay: true, color: 'blue', textColor: 'white' },
      [endDate]: { endingDay: true, color: 'blue', textColor: 'white' },
    };
  };

  const setPresetRange = (range) => {
    const today = new Date();
    let startDate, endDate;

    switch (range) {
      case 'today':
        startDate = endDate = today.toISOString().split('T')[0];
        break;
      case 'week':
        endDate = today.toISOString().split('T')[0];
        startDate = new Date(today.setDate(today.getDate() - 6)).toISOString().split('T')[0];
        break;
      case '1month':
        endDate = today.toISOString().split('T')[0];
        startDate = new Date(today.setMonth(today.getMonth() - 1)).toISOString().split('T')[0];
        break;
      case '6months':
        endDate = today.toISOString().split('T')[0];
        startDate = new Date(today.setMonth(today.getMonth() - 6)).toISOString().split('T')[0];
        break;
      case '1year':
        endDate = today.toISOString().split('T')[0];
        startDate = new Date(today.setFullYear(today.getFullYear() - 1)).toISOString().split('T')[0];
        break;
      default:
        return;
    }

    setSelectedRange({ startDate, endDate });
    onDateRangeChange(startDate, endDate);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.text}>
          {selectedRange.startDate && selectedRange.endDate
            ? `Selected Range: ${selectedRange.startDate} - ${selectedRange.endDate}`
            : 'Select Date Range'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Calendar
            markingType={'period'}
            markedDates={getMarkedDates()}
            onDayPress={handleDayPress}
            monthFormat={'yyyy MMMM'}
          />
          <View style={styles.presetButtonsContainer}>
            {['today', 'week', '1month', '6months', '1year'].map((range) => (
              <TouchableOpacity key={range} onPress={() => setPresetRange(range)} style={styles.presetButton}>
                <Text style={styles.presetButtonText}>{range.replace(/([A-Z])/g, ' $1').toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.footer}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'blue',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    paddingBottom: 80,
  },
  presetButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  presetButton: {
    backgroundColor: '#0D6EFD',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  presetButtonText: {
    color: 'white',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: 'black',
  },
  submitButton: {
    backgroundColor: '#0D6EFD',
    padding: 10,
    borderRadius: 5,
  },
  submitButtonText: {
    color: 'white',
  },
});

export default DateRangeSector;

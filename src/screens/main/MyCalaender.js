import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Modal, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyCalendar = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [eventText, setEventText] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [events, setEvents] = useState([]);
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDayPress = day => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

  const handleSaveEvent = async () => {
    try {
      // Check if the event text is empty
      if (!eventText.trim()) {
        console.warn('Event text is empty. Event not saved.');
        return;
      }
  
      const existingEvents = await AsyncStorage.getItem('events');
      const parsedEvents = existingEvents ? JSON.parse(existingEvents) : [];
      const newEvent = { date: selectedDate, text: eventText };
      const updatedEvents = [...parsedEvents, newEvent];
  
      await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
  
      setEvents(updatedEvents);
      setMarkedDates({ ...markedDates, [selectedDate]: { selected: true, marked: true, dotColor: 'red' } });
      setModalVisible(false);
      setEventText('');
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };
  const loadEvents = async () => {
    try {
      const existingEvents = await AsyncStorage.getItem('events');
      const parsedEvents = existingEvents ? JSON.parse(existingEvents) : [];
      const groupedEvents = {};

      parsedEvents.forEach(event => {
        if (groupedEvents[event.date]) {
          groupedEvents[event.date].push(event);
        } else {
          groupedEvents[event.date] = [event];
        }
      });

      setEvents(Object.values(groupedEvents));

      const markedDatesObj = Object.keys(groupedEvents).reduce((obj, date) => {
        obj[date] = { marked: true, dotColor: 'red' };
        return obj;
      }, {});

      setMarkedDates(markedDatesObj);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const handleCancelEvent = () => {
    setModalVisible(false);
    setEventText('');
  };

  const renderEventItem = ({ item }) => (
    <View style={styles.eventItem}>
      {item && item[0] && (
        <>
          <Text style={styles.eventDate}>{item[0].date}</Text>
          {item.length === 1 ? (
            <Text style={styles.eventText}>{item[0].text}</Text>
          ) : (
            item.map((event, index) => (
              <Text style={styles.eventText} key={index}>
                {`${index + 1}. ${event.text}`}
              </Text>
            ))
          )}
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={{ color: 'black', fontSize: 24, fontWeight: 'bold', alignSelf: 'center', marginBottom: 12 }}> calendar</Text>
      <Calendar
        style={styles.calendar}
        theme={{
          calendarBackground: '#FFFFFF',
          selectedDayBackgroundColor: '#2E66E7',
          todayTextColor: '#2E66E7',
          dayTextColor: '#333',
          textDayFontWeight: '600',
          textMonthFontWeight: 'bold',
        }}
        current={'2012-03-01'}
        onDayPress={handleDayPress}
        markedDates={{
          ...markedDates,
          [selectedDate]: { selected: true, marked: true, dotColor: 'red' },
        }}
      />
      <FlatList
        data={events}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderEventItem}
        style={styles.flatList}
      />
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Enter event details"
              onChangeText={text => setEventText(text)}
            />
            <Button title="Save Event" onPress={handleSaveEvent} color="#2E66E7" />
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEvent}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
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
    backgroundColor: '#F5FCFF',
    padding: 16,
  },
  calendar: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    marginBottom: 16,
  },
  flatList: {
    flex: 1,
  },
  eventItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  eventDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
  },
  eventText: {
    fontSize: 14,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  input: {
    height: 40,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  cancelButton: {
    backgroundColor: '#FF5757',
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default MyCalendar;

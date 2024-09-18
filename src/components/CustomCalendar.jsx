import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {Calendar} from 'react-native-calendars';

const CustomCalendar = () => {
  const [selectedDate, setSelectedDate] = useState('');

  const onDayPress = day => {
    setSelectedDate(day.dateString);
  };
  return (
    <View>
      <Calendar
        onDayPress={onDayPress}
        markedDates={{
        [selectedDate]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
      }}
        // markedDates={{[selectedDate]: {selected: true, selectedColor: 'blue'}}}
      />
      {selectedDate !== '' && (
        <View style={{margin: 20}}>
          <Text>Selected Date: {selectedDate}</Text>
        </View>
      )}
    </View>
  );
};

export default CustomCalendar;

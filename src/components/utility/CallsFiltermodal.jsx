import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Picker } from 'react-native';
import DateRangeSector from './DateRangeSelector';
  
const CallsFilterModal = ({ applyFilter, dateRange, setDateRange }) => {
  const [userList, setUserList] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await users(1, 100); // Adjust pagination as needed
        setUserList(data.items);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDateRangeChange = (startDate, endDate) => {
    setDateRange({ startDate, endDate });
  };

  const handleApplyFilter = () => {
    applyFilter(selectedUserId, dateRange);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filter Calls</Text>
      
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Select User:</Text>
        <Picker
          selectedValue={selectedUserId}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedUserId(itemValue)}
        >
          <Picker.Item label="All Users" value={null} />
          {userList.map(user => (
            <Picker.Item key={user.id} label={user.firstName} value={user.id} />
          ))}
        </Picker>
      </View>

      <DateRangeSector onDateRangeChange={handleDateRangeChange} />

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleApplyFilter} style={styles.submitButton}>
          <Text style={styles.buttonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CallsFilterModal;

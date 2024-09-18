import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import DateRangeSector from './DateRangeSelector';

const FilterModal = ({ leadStatusData, applyFilter, selectedStatusId, dateRange, setDateRange }) => {
  const [dropdownValue, setDropdownValue] = useState('Select Status');
  const [priorityValue, setPriorityValue] = useState('Select Priority');

  useEffect(() => {
    const selectedStatus = leadStatusData.find(status => status.id === selectedStatusId);
    if (selectedStatus) {
      setDropdownValue(selectedStatus.name);
    } else {
      setDropdownValue('Select Status');
    }
  }, [selectedStatusId, leadStatusData]);

  const handleStatusSelect = (index, value) => {
    const selectedId = leadStatusData[index].id;
    setDropdownValue(value);
    applyFilter(selectedId, dateRange, priorityValue);
  };

  const handlePrioritySelect = (index, value) => {
    setPriorityValue(value);
    applyFilter(selectedStatusId, dateRange, value);
  };

  const handleDateRangeChange = (startDate, endDate) => {
    const newDateRange = { startDate, endDate };
    setDateRange(newDateRange); // Update state in LeadsList
    applyFilter(selectedStatusId, newDateRange, priorityValue);
  };

  return (
    <View style={styles.modalContainer}>
      <Text style={styles.title}>Filter Options</Text>

      <ModalDropdown
        options={leadStatusData.map(status => status.name)}
        style={styles.dropdown}
        onSelect={handleStatusSelect}
        defaultValue={dropdownValue}
        textStyle={styles.dropdownText}
        dropdownStyle={styles.dropdownStyle}
        dropdownTextStyle={styles.dropdownText}
      />

      <ModalDropdown
        options={['High', 'Medium', 'Low']}
        style={styles.dropdown}
        onSelect={handlePrioritySelect}
        defaultValue={priorityValue}
        textStyle={styles.dropdownText}
        dropdownStyle={styles.dropdownStyle}
        dropdownTextStyle={styles.dropdownText}
      />

      <DateRangeSector onDateRangeChange={handleDateRangeChange} />
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    elevation: 4,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '50%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dropdown: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderWidth: 0.5,
    borderRadius: 10,
    marginTop: 20,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 10,
  },
  dropdownStyle: {
    width: '80%',
    marginTop: 20,
    elevation: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
});

export default FilterModal;

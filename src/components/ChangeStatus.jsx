import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import DynamicModal from './DynamicModal';
import ModalDropdown from 'react-native-modal-dropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { UpdateLeadStatus } from '../services/leadService';

const ChangeStatus = (props) => {
  const { selectedLead, modalVisible, setModalVisible, leadIdForComment } = props;

  const [selectedStatus, setSelectedStatus] = useState(selectedLead?.status || null);
  const [followUpDate, setFollowUpDate] = useState(null);
  const [comment, setComment] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    if (modalVisible) {
      setSelectedStatus(selectedLead?.status || null);
      setFollowUpDate(null);
      setComment('');
    }
  }, [modalVisible, selectedLead, leadIdForComment]);

  const dropdownOptions = [
    
    { id: 0, name: 'Any ' },
    { id: 1, name: 'New Lead' },
     { id: 2, name: 'Prospect' },
    { id: 3, name: 'Cold' },
    { id: 4, name: 'Hot' },
    { id: 5, name: 'Attempting to Contact' },
    { id: 6, name: 'Dropped or Not Interested' },
    { id: 7, name: 'Invalid / Junk' },
    { id: 8, name: 'Follow Up For Next Session' },
    { id: 9, name: 'Submitted' },
    { id: 10, name: 'Closed Lost' },
    { id: 11, name: 'Not Reachable' },
    { id: 12, name: 'CallBack and Follow Up' },
    { id: 13, name: 'Rejected' },
    { id: 14, name: 'Language Barrier' },
    { id: 15, name: 'Not Eligible' },
    { id: 16, name: 'Enrolled' },
  ];

  const handleStatusChange = async () => {
    const leadId = (selectedLead?.id || leadIdForComment || '').toString(); // Check for null or undefined
  
    if (leadId) {
      const data = {
        id: leadId,
        followUpDate: followUpDate ? followUpDate.toISOString() : null,
        status: selectedStatus,
        description: comment,
      };
  
      console.log('Data being sent to API:', data);
  
      try {
        const response = await UpdateLeadStatus(data);
        console.log('Response from API:', response);
        setModalVisible(false);
      } catch (error) {
        console.error('Error updating lead status:', error);
      }
    } else {
      console.error('No lead ID found for update!');
    }
  };

  const handleConfirmDateTimeForFollowUp = (date) => {
    console.log('Selected Date and Time:', date);
    setFollowUpDate(date);
    setDatePickerVisibility(false);
  };

  const showDateTimePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDateTimePicker = () => {
    setDatePickerVisibility(false);
  };

  const commentInputRef = useRef(null);

  const handleClearText = () => {
    commentInputRef.current.clear();
    setComment('');
    setFollowUpDate(null);
  };

  const defaultValue = dropdownOptions.find(option => option.id === selectedStatus)?.name || 'Any';

  return (
    <DynamicModal
      isVisible={modalVisible}
      closeModal={() => {
        setModalVisible(false);
        setSelectedStatus(selectedLead?.status || null);
        setFollowUpDate(null);
        setComment('');
      }}
      heading={'Select Lead Status & Leave comment'}
      content={[
        <View
          key="commentInput"
          style={{
            paddingHorizontal: 10,
            width: 320,
            justifyContent: 'center',
            paddingVertical: 10,
          }}>
          <ModalDropdown
            key={selectedStatus}  // Use key to force re-render
            options={dropdownOptions.map(option => option.name)}
            onSelect={(index) => {
              const selectedId = dropdownOptions[index].id;
              console.log('Selected Status ID:', selectedId);
              setSelectedStatus(selectedId);
            }}
            defaultValue={defaultValue}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 5,
              marginBottom: 10,
              paddingHorizontal: 10,
              paddingVertical: 8,
              backgroundColor: '#fff',
            }}
            textStyle={{ color: 'black', fontSize: 16 }}
            dropdownStyle={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 5,
              paddingVertical: 8,
              backgroundColor: '#fff',
            }}
            dropdownTextStyle={{ color: 'black', fontSize: 16, width: 270 }}
            dropdownTextHighlightStyle={{ backgroundColor: '#ddd' }}
            defaultIndex={dropdownOptions.findIndex(option => option.id === selectedStatus)}
          />
          <TouchableOpacity onPress={showDateTimePicker}>
            <Text
              style={{
                borderRadius: 5,
                borderWidth: 0.8,
                borderColor: '#ccc',
                paddingHorizontal: 10,
                paddingVertical: 12,
                marginBottom: 10,
                backgroundColor: '#fff',
              }}>
              {followUpDate
                ? followUpDate.toLocaleString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                  })
                : 'Select Date and Time'}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            onConfirm={handleConfirmDateTimeForFollowUp}
            onCancel={hideDateTimePicker}
            date={new Date()}
            locale="en_GB"
            timeZoneOffsetInMinutes={330}
          />

          <TextInput
            ref={commentInputRef}
            multiline={true}
            numberOfLines={5}
            style={{
              borderRadius: 5,
              borderWidth: 0.8,
              borderColor: '#ccc',
              paddingHorizontal: 10,
              marginBottom: 10,
              backgroundColor: '#fff',
            }}
            placeholder="Add comment"
            placeholderTextColor="black"
            onChangeText={text => setComment(text)}
          />
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: '#eee',
                borderRadius: 5,
                paddingVertical: 12,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 5,
              }}
              onPress={handleClearText}>
              <Text style={{ color: 'black', fontWeight: 'bold' }}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: '#34a8eb',
                borderRadius: 5,
                paddingVertical: 12,
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 5,
              }}
              onPress={handleStatusChange}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>,
      ]}
    />
  );
};

export default ChangeStatus;

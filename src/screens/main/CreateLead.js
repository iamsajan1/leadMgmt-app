import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import {Icon, TextInput} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import {State, City} from 'country-state-city';
import InputField from './InputField';
import Modal from 'react-native-modal';
import DynamicModal from '../../components/DynamicModal';
import {styles} from '../../styles/Stylesheet';
import {
  universityCourse,
  universitySubCourse,
} from '../../services/universitiesService';
import {postLead} from '../../services/leadService';
import {users} from '../../services/userService';
import {
  GetCoursesDropdown,
  GetSubCoursesDropdown,
} from '../../services/files/coursesService';

const CreateLeads = () => {
  const PriorityOptions = [
    { id: 1, name: 'Low' },
    { id: 2, name: 'Medium' },
    { id: 3, name: 'High' },
  ];  
  
  const [selectedPriorityId, setSelectedPriorityId] = useState(0);
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [alternateEmail, setAlternateEmail] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState('');
  const [date, setDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const {width} = Dimensions.get('window');
  const [formattedDate, setFormattedDate] = useState(
    date ? date.toDateString() : '',
  );
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedState, setSelectedState] = useState(null);
  const [selectedStateISO, setSelectedStateISO] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [assignees, setAssignees] = useState([]);
  const [titleError, setTitleError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [alternateEmailError, setAlternateEmailError] = useState('');
  const [alternatePhoneError, setAlternatePhoneError] = useState('');
  const [dateOfBirthError, setDateOfBirthError] = useState('');
  const [courseError, setCourseError] = useState('');
  const [assigneeError, setAssigneeError] = useState('');
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [selectedSubCourse, setSelectedSubCourse] = useState('');
  const [subCourseError, setSubCourseError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalHeading, setModalHeading] = useState('');
  const [modalContent, setModalContent] = useState([]);
  const [selectedAssigneeId, setSelectedAssigneeId] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [subCourses, setSubCourses] = useState([]);
  const [isOtherCourse, setIsOtherCourse] = useState(false);
  const [isOtherSubCourse, setIsOtherSubCourse] = useState(false);
  const [customCourse, setCustomCourse] = useState('');
  const [customSubCourse, setCustomSubCourse] = useState('');
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseData = await GetCoursesDropdown();
        if (Array.isArray(courseData.data)) {
          setCourses(courseData.data);
        } else {
          console.error('Unexpected data format:', courseData);
          setCourses([]);
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        setCourses([]);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchSubCourses = async () => {
      if (selectedCourseId) {
        try {
          const subCoursesResponse = await GetSubCoursesDropdown(
            selectedCourseId,
          );
          if (Array.isArray(subCoursesResponse.data)) {
            setSubCourses(subCoursesResponse.data);
          } else {
            console.error(
              'Unexpected subcourse data format:',
              subCoursesResponse,
            );
            setSubCourses([]);
          }
        } catch (error) {
          console.error('Failed to fetch subcourses:', error);
          setSubCourses([]);
        }
      }
    };

    fetchSubCourses();
  }, [selectedCourseId]);

  useEffect(() => {
    const fetchAssignees = async () => {
      try {
        const userData = await users(1, 10);
        const assigneesData = userData.data.items.map(user => ({
          id: user.id,
          name: user.firstName,
        }));
        setAssignees(assigneesData);
      } catch (error) {
        console.error('Error fetching assignees:', error);
      }
    };

    fetchAssignees();
  }, []);
  // const selectCity = (city) => {
  //   setSelectedCity(city.name); // Set the selected city name in the state
  //   setCityModalVisible(false); // Close the modal after selecting the city
  // };
  const submit = async () => {
    if (validateForm()) {
      const leadData = {
        fullName: title,
        emailAddress: email,
        alternateEmailAddress: alternateEmail,
        phone: phone,
        alternatePhone: alternatePhone,
        assignName: selectedAssignee,
         priorityName: selectedPriority,
         priorityId: selectedPriorityId,
        dateOfBirth: dateOfBirth ? dateOfBirth.toISOString() : null,
        courseName: isOtherCourse ? customCourse : selectedCourse,
        subCourseName: isOtherSubCourse ? customSubCourse : selectedSubCourse,
        stateName: selectedState,
        distictName: selectedCity,
        assignTo: selectedAssigneeId,
        universityId: '',
      };

      const response = await postLead(leadData);
      console.log('Response:', response);
      if (response && response.data.status?.code == 200) {
        alert('Lead Created successfully');
        resetForm();
      } else {
        console.error(
          'Failed to create lead:',
          response?.status?.code,
          response?.statusText,
        );
      }
    }
  };
  const resetForm = () => {
    setTitle('');
    setEmail('');
    setPhone('');
    setAlternateEmail('');
    setAlternatePhone('');
    setDateOfBirth(null);
    setSelectedPriority('');
    setDate(null);
    setSelectedAssignee('');
    setSelectedCourse('');
    setSelectedState(null);
    setSelectedCity(null);
    setSelectedSubCourse('');
    setSelectedPriorityId(0);
    setIsOtherCourse(false);
    setIsOtherSubCourse(false);
    setCustomCourse('');
    setCustomSubCourse('');
  };
  const handleStateChange = value => {
    setSelectedState(value);
  };
  const selectCity = city => {
    setSelectedCity(city);
    closeModal();
  };

  const renderError = error => {
    return error ? (
      <Text style={{color: 'red', marginLeft: 15, marginRight: 0}}>
        {error} *
      </Text>
    ) : null;
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };
  const validateForm = () => {
    const validations = [
      {field: title, setError: setTitleError, message: 'Full name is required'},
      {
        field: email,
        setError: setEmailError,
        message: 'Email is required',
        validation: isValidEmail,
      },
      {
        field: phone,
        setError: setPhoneError,
        message: 'Phone number is required',
        validation: isValidPhone,
      },
    ];

    if (dateOfBirth) {
      validations.push({
        field: dateOfBirth,
        setError: setDateOfBirthError,
        message: 'Date of birth is required',
      });
    }

    let isValid = true;

    validations.forEach(({field, setError, message, validation}) => {
      const isValidField = validation ? validation(field) : field;
      setError(isValidField ? '' : message);
      if (!isValidField) {
        isValid = false;
      }
    });

    return isValid;
  };

  const isValidEmail = email => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const isValidPhone = phone => {
    return /^[0-9]{10}$/.test(phone);
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setFormattedDate(selectedDate.toDateString());
      setDateOfBirth(selectedDate);
    }
  };

  const openModal = (heading, content) => {
    setModalHeading(heading);
    setModalContent(Array.isArray(content) ? content : [content]);
    setModalVisible(true);
  };

  const selectAssignee = (assignee, id) => {
    console.log('Selected Assignee ID:', id);
    setSelectedAssignee(assignee);
    setSelectedAssigneeId(id);
    closeModal();
  };
  const selectPriority = (priority) => {
    const selected = PriorityOptions.find(option => option.name === priority);
    setSelectedPriority(priority);
    setSelectedPriorityId(selected ? selected.id : null);
    console.log('Selected Priority ID:', selectedPriorityId);
    closeModal();
  };
  useEffect(() => {
    console.log('Updated Selected Priority ID:', selectedPriorityId);
  }, [selectedPriorityId]);
  const closeModal = () => {
    setModalVisible(false);
  };

  const selectState = state => {
    setSelectedState(state);
    closeModal();
  };

  const selectCourse = (course, id) => {
    if (course === 'Other') {
      setIsOtherCourse(true);
      setSelectedCourse('');
      setSelectedCourseId(null);
      setIsOtherSubCourse(false);
    } else {
      setIsOtherCourse(false);
      setSelectedCourse(course);
      setSelectedCourseId(id);
      setIsOtherSubCourse(false);
    }
    closeModal();
  };

  const selectSubCourse = subCourse => {
    if (subCourse === 'Other') {
      setIsOtherSubCourse(true);
      setSelectedSubCourse('');
    } else {
      setIsOtherSubCourse(false);
      setSelectedSubCourse(subCourse);
    }
    closeModal();
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f3f3f3'}}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <KeyboardAvoidingView behavior="padding">
          <View style={{marginVertical: 5, marginLeft: 15}}>
            <Text style={{fontSize: 18, color: 'grey'}}>Main Details:-</Text>
          </View>
          <InputField
            style={styles.inputBox}
            placeholderTextColor="grey"
            label={'full Name'}
            mode="outlined"
            activeOutlineColor="grey"
            contentStyle={{
              paddingLeft: titleError ? width * 0.04 : 0,
              color: 'grey',
            }}
            outlineStyle={{borderColor: 'grey'}}
            value={title}
            onChangeText={text => setTitle(text)}
            error={!!titleError}
            renderErrorText={titleError}
          />

          <InputField
            style={styles.inputBox}
            placeholderTextColor="grey"
            label={'Email address'}
            keyboardType="email-address"
            mode="outlined"
            activeOutlineColor="grey"
            contentStyle={{paddingLeft: titleError ? width * 0.04 : 0}}
            outlineStyle={{borderColor: 'grey'}}
            value={email}
            onChangeText={text => setEmail(text)}
            error={!!emailError}
            renderErrorText={emailError}
          />

          <InputField
            style={styles.inputBox}
            placeholderTextColor="grey"
            label={'Phone Number'}
            keyboardType="numeric"
            mode="outlined"
            activeOutlineColor="grey"
            contentStyle={{paddingLeft: width * 0.04}}
            outlineStyle={{borderColor: 'grey'}}
            value={phone}
            onChangeText={text => setPhone(text)}
            error={!!phoneError}
            renderErrorText={phoneError}
          />
          <TouchableOpacity
            onPress={() => setShowAdditionalFields(!showAdditionalFields)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              paddingVertical: 5,
              borderRadius: 5,
              borderColor: 'grey',
              marginTop: 15,
            }}>
            <Text
              style={{
                marginRight: 5,
                color: 'black',
                fontSize: 15,
                fontWeight: '600',
              }}>
              {showAdditionalFields
                ? 'Hide Additional Fields'
                : 'Show Additional Fields'}
            </Text>
            <Icon
              source={showAdditionalFields ? 'chevron-up' : 'chevron-down'}
              size={20}
              style={{
                color: 'black', // Set icon color
              }}
            />
          </TouchableOpacity>

          {showAdditionalFields && (
            <>
              {isOtherCourse ? (
                <>
                  <InputField
                    style={styles.inputBox}
                    placeholderTextColor="grey"
                    label={'Enter Course Name'}
                    mode="outlined"
                    activeOutlineColor="grey"
                    contentStyle={{paddingLeft: width * 0.04}}
                    outlineStyle={{borderColor: 'grey'}}
                    value={customCourse}
                    onChangeText={text => setCustomCourse(text)}
                  />
                  <InputField
                    style={styles.inputBox}
                    placeholderTextColor="grey"
                    label={'Enter Subcourse Name'}
                    mode="outlined"
                    activeOutlineColor="grey"
                    contentStyle={{paddingLeft: width * 0.04}}
                    outlineStyle={{borderColor: 'grey'}}
                    value={customSubCourse}
                    onChangeText={text => setCustomSubCourse(text)}
                  />
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() =>
                      openModal(
                        'Select Course',
                        courses && courses.length > 0 ? (
                          courses
                            .concat({id: 'other', name: 'Other'})
                            .map(course => (
                              <TouchableOpacity
                                key={course.id}
                                style={styles.rowStyle}
                                onPress={() => {
                                  if (course.id === 'other') {
                                    setIsOtherCourse(true);
                                    closeModal(); // Close modal when "Other" is selected
                                  } else {
                                    setIsOtherCourse(false);
                                    selectCourse(course.name, course.id);
                                  }
                                }}>
                                <Text style={styles.rowTextStyle}>
                                  {course.name}
                                </Text>
                              </TouchableOpacity>
                            ))
                        ) : (
                          <Text>No Courses Available</Text>
                        ),
                      )
                    }>
                    <Text style={styles.modalButtonText}>
                      {selectedCourse || 'Select Course'}
                    </Text>
                    {styles.renderModalIcon()}
                  </TouchableOpacity>

                  {!isOtherCourse && selectedCourse && (
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={() =>
                        openModal(
                          'Select Subcourse',
                          subCourses
                            .concat({id: 'other', name: 'Other'})
                            .map(subcourse => (
                              <TouchableOpacity
                                key={subcourse.id}
                                style={styles.rowStyle}
                                onPress={() => {
                                  if (subcourse.id === 'other') {
                                    setIsOtherSubCourse(true);
                                    closeModal(); // Close modal when "Other" is selected
                                  } else {
                                    setIsOtherSubCourse(false);
                                    selectSubCourse(subcourse.name);
                                  }
                                }}>
                                <Text style={styles.rowTextStyle}>
                                  {subcourse.name}
                                </Text>
                              </TouchableOpacity>
                            )),
                        )
                      }>
                      <Text style={styles.modalButtonText}>
                        {selectedSubCourse || 'Select Subcourse'}
                      </Text>
                      {styles.renderModalIcon()}
                    </TouchableOpacity>
                  )}
                </>
              )}

              {renderError(courseError)}

              {isOtherSubCourse && (
                <InputField
                  style={styles.inputBox}
                  placeholderTextColor="grey"
                  label={'Enter Subcourse Name'}
                  mode="outlined"
                  activeOutlineColor="grey"
                  contentStyle={{paddingLeft: width * 0.04}}
                  outlineStyle={{borderColor: 'grey'}}
                  value={selectedSubCourse}
                  onChangeText={text => setSelectedSubCourse(text)}
                />
              )}

              {renderError(subCourseError)}

              <TextInput
                style={{marginHorizontal: 11, backgroundColor: '#fff'}}
                placeholderTextColor="grey"
                label={'Date of Birth'}
                mode="outlined"
                activeOutlineColor="grey"
                value={formattedDate}
                editable={true}
                onTouchStart={showDatepicker}
                outlineStyle={{borderRadius: 50, borderWidth: 0.2}}
              />

              {showDatePicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date || new Date()}
                  mode="date"
                  is24Hour={true}
                  onChange={onDateChange}
                />
              )}

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() =>
                  openModal(
                    'Select State',
                    State.getStatesOfCountry('IN').map(state => (
                      <TouchableOpacity
                        key={state.isoCode}
                        style={styles.rowStyle}
                        onPress={() => {
                          selectState(state.name);
                          setSelectedStateISO(state.isoCode);
                        }}>
                        <Text style={styles.rowTextStyle}>{state.name}</Text>
                      </TouchableOpacity>
                    )),
                  )
                }>
                <Text style={styles.modalButtonText}>
                  {selectedState || 'Select State'}
                </Text>
                {styles.renderModalIcon()}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() =>
                  openModal(
                    'Select City',
                    City.getCitiesOfState('IN', selectedStateISO).map(city => (
                      <TouchableOpacity
                        key={city.name}
                        style={styles.rowStyle}
                        onPress={() => selectCity(city.name)}>
                        <Text style={styles.rowTextStyle}>{city.name}</Text>
                      </TouchableOpacity>
                    )),
                  )
                }>
                <Text style={styles.modalButtonText}>
                  {selectedCity || 'Select City'}
                </Text>
                {styles.renderModalIcon()}
              </TouchableOpacity>

              <View style={{marginVertical: 15, marginLeft: 15}}>
                <Text style={{fontSize: 18, color: 'grey'}}>
                  Other Details:-
                </Text>
              </View>

              <InputField
                style={styles.inputBox}
                placeholderTextColor="grey"
                label={' Alternate Email address'}
                keyboardType="email-address"
                mode="outlined"
                activeOutlineColor="grey"
                contentStyle={{paddingLeft: width * 0.04}}
                outlineStyle={{borderColor: 'grey'}}
                value={alternateEmail}
                onChangeText={text => setAlternateEmail(text)}
                error={!!alternateEmailError}
                renderErrorText={alternateEmailError}
              />

              <InputField
                style={styles.inputBox}
                placeholderTextColor="grey"
                label={'Other Phone Number'}
                keyboardType="numeric"
                mode="outlined"
                activeOutlineColor="grey"
                contentStyle={{paddingLeft: width * 0.04}}
                outlineStyle={{borderColor: 'grey'}}
                value={alternatePhone}
                onChangeText={text => setAlternatePhone(text)}
                error={!!alternatePhoneError}
                renderErrorText={alternatePhoneError}
              />
<TouchableOpacity
  style={styles.modalButton}
  onPress={() =>
    openModal(
      'Select Priority',
      PriorityOptions.map(option => (
        <TouchableOpacity
          key={option.id}
          style={styles.rowStyle}
          onPress={() => {
            console.log('Selected Priority Option:', option);
            selectPriority(option.name);
            // Delay closing the modal to ensure state update
            setTimeout(() => closeModal(), 100);
          }}>
          <Text style={styles.rowTextStyle}>{option.name}</Text>
        </TouchableOpacity>
      )),
    )
  }>
  <Text style={styles.modalButtonText}>
    {selectedPriority || 'Select Priority'}
  </Text>
  {styles.renderModalIcon()}
</TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() =>
                  openModal(
                    'Select Assignee',
                    assignees.map(assignee => (
                      <TouchableOpacity
                        key={assignee.id}
                        style={styles.rowStyle}
                        onPress={() =>
                          selectAssignee(assignee.name, assignee.id)
                        }>
                        <Text style={styles.rowTextStyle}>{assignee.name}</Text>
                      </TouchableOpacity>
                    )),
                  )
                }>
                <Text style={styles.modalButtonText}>
                  {selectedAssignee || 'Select Assignee'}
                </Text>
                {styles.renderModalIcon()}
              </TouchableOpacity>
              {renderError(assigneeError)}
              <InputField
                style={styles.inputBox}
                label={'Description'}
                placeholderTextColor="grey"
                mode="outlined"
                activeOutlineColor="grey"
                contentStyle={{paddingLeft: width * 0.04}}
                outlineStyle={{borderColor: 'grey'}}
              />

              <TouchableOpacity style={styles.submitButton} onPress={submit}>
                <Text style={styles.submitButtonText}>Create Lead</Text>
              </TouchableOpacity>
            </>
          )}

          <DynamicModal
            isVisible={modalVisible}
            closeModal={closeModal}
            heading={modalHeading}
            content={modalContent}
          />
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateLeads;

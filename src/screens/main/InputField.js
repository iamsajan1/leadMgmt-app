// InputField.js
import React from 'react';
import { Text } from 'react-native';
import { TextInput } from 'react-native-paper';

const InputField = ({ label, placeholder, keyboardType, value, onChangeText, error, style, renderErrorText }) => {
  const renderError = (error) => {
    return error ? (
      <Text style={{ color: 'red', marginLeft: 15, marginRight: 0 }}>{error} *</Text>
    ) : null;
  };
  return (
    <><TextInput
      style={[style, error ? styles.errorInputBox : styles.inputBox]} // Apply both style and error styles
      placeholderTextColor="grey"
      label={label}
      placeholder={placeholder}
      keyboardType={keyboardType}
      mode="outlined"
      outlineStyle={{ borderColor: 'grey', borderRadius: 50, borderWidth:0.3, backgroundColor: 'white', }}
      activeOutlineColor="grey"
      value={value}
      onChangeText={onChangeText}
      error={!!error}
    />
    {renderError(renderErrorText)}
    </>
  );
};

const styles = {
  inputBox: {
    marginBottom: 2,
    width: '95%',
    marginLeft: 10,
    backgroundColor: 'white',
    borderColor: 'grey',   
    borderRadius: 50,      
  },
  errorInputBox: {
    marginBottom: 0,
    width: '95%',
    marginLeft: 10,
    backgroundColor: 'white',
    borderColor: 'red',
    borderRadius: 55,
  },
};

export default InputField;

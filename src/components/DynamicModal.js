import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Modal from 'react-native-modal';

const DynamicModal = ({ isVisible, closeModal, heading, content }) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={closeModal}
      onSwipeComplete={closeModal}
      swipeDirection={['down']}
      style={{ justifyContent: 'flex-end', margin: 0 }}
    >
      <View style={styles.modalContent}>
        <ScrollView style={styles.modalScrollView}>
          <Text style={{ fontSize: 18, color: 'black', marginBottom: 20, fontWeight: 'bold' }}>
            {heading}
          </Text>
          {content ? (
            content.map((item, index) => (
              <Text key={index} style={styles.modalOption}>
                {item}
              </Text>
            ))
          ) : (
            <Text style={{ color: 'grey' }}>No content available</Text>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = {
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  modalScrollView: {
    maxHeight: '100%',
    flexGrow: 1,
  },
  modalOption: {
    marginTop: 10,
    fontSize: 16,
    color: 'black',
    borderBottomWidth: 0.2,
    borderBottomColor: 'grey',
  },
};

export default DynamicModal;

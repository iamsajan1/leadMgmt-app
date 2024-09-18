import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {styles} from '../styles/Stylesheet';
import {getUniversities} from '../services/universitiesService';
import DynamicModal from './DynamicModal';
import {Card} from 'react-native-paper';
import {getDataAsync, storeDataAsync} from './Hooks/DataAsyncStorage';
import SkeletonLoadingView from './SkeletonLoadingView';
import {SucceededToaster} from './utility/Toaster';

const SelectUniversity = ({children}) => {
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [universitiesList, setUniversitiesList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalHeading, setModalHeading] = useState('');
  const [modalContent, setModalContent] = useState([]);
  const openModal = (heading, content) => {
    setModalHeading(heading);
    setModalContent(Array.isArray(content) ? content : [content]);
    setModalVisible(true);
  };
  const fetchUniversities = async () => {
    const data = await getUniversities();
    if (data.status.code === 200) {
      setUniversitiesList(data.data.items);
      setUniversitiesList(data.data.items);
      setSelectedUniversity(data.data.items[0]);
    } else {
      SucceededToaster('Universities List Not Fetch');
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);



  return (
    <>
      <TouchableOpacity
        // style={styles.modalButton}
        
        onPress={() =>
          openModal(
            'Select University',
            universitiesList.map(university => (
              <TouchableOpacity
              
                key={university.id}
                style={styles.rowStyle}
                onPress={async () => {
                  await storeDataAsync('selectedUniversity', university);
                  setSelectedUniversity(university);
                  setModalVisible(false);
                }}>
                <Text style={styles.rowTextStyle}>{university.name}</Text>
              </TouchableOpacity>
            )),
          )
        }>
        <View>
          <Card style={{width:"79%", borderRadius: 50, borderWidth:0}} mode='contained'>
            <Card.Content
              style={{
                height: 40,
                backgroundColor: '#fff',
                 paddingVertical: 10,
                borderWidth: 0.1,
                borderRadius: 50,
                
                 }}>
              <Text style={{color: 'gray'}}>
                {!selectedUniversity ? (
                  <SkeletonLoadingView />
                ) : (
                  selectedUniversity.name
                )}
              </Text>
            </Card.Content>
          </Card>
        </View>
      </TouchableOpacity>
      <DynamicModal
        isVisible={modalVisible}
        closeModal={() => setModalVisible(false)}
        heading={modalHeading}
        content={modalContent}
      />
    </>
  );
};

export default SelectUniversity;

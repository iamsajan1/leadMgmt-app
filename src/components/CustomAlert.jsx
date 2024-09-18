import React, {useState} from 'react';
import { View } from 'react-native';
import {ScrollView} from 'react-native';
import {Button, Dialog, Portal, Text} from 'react-native-paper';

const CustomAlert = () => {
  const [visible, setVisible] = useState(true);

  const hideDialog = () => setVisible(false);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog} style={{textAlign:'center', marginVertical:0, paddingVertical:0}}>
          <Dialog.Icon icon="alert" color='red'/>
        <Dialog.Title style={{textAlign:'center', marginVertical:0, paddingVertical:0}}>
          Update Alerts
        </Dialog.Title>
        <Dialog.ScrollArea>
          <ScrollView contentContainerStyle={{paddingHorizontal: 24}}>
            <View>
              <Text style={{marginBottom:15}}>
                We hope this message finds you well. We are excited to inform
                you about the latest updates to APS Matrix. Our commitment to
                enhancing your experience is at the forefront of our efforts,
                and these updates aim to bring you even more value. Key
                Highlights of the Update:
              </Text>
              <Text style={{marginBottom:10, fontWeight:800}}>
                Feature 1 : Brief description of the new feature and its
                benefits.
              </Text>
              <Text style={{marginBottom:15, fontWeight:800}}>
                Feature 2 : Another key enhancement or addition, explained
                briefly.
              </Text>
              <Text style={{marginBottom:15, fontWeight:800}}>
                Feature 3: Highlight any additional improvements or fixes
                included in this update.
              </Text>
            </View>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={() => setVisible(false)}>Cancel</Button>
          <Button onPress={() => setVisible(false)}>Update</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default CustomAlert;

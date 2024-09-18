import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, IconButton, Colors, Surface, Card } from 'react-native-paper';

const EmailDetail = ({ route }) => {
  if (!route.params) {
    return (
      <View>
        <Text>Email parameters not provided.</Text>
      </View>
    );
  }

  const { subject, sender, content } = route.params;

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title={subject}
          subtitle={sender}
          subtitleStyle={styles.sender}
        />
        <Card.Content>
          <Text style={styles.content}>{content}</Text>
        </Card.Content>
        <Card.Actions>
          <IconButton
            icon="reply"
            color='grey'  
            size={24}
            onPress={() => console.log('Reply pressed')}
          />
          <IconButton
            icon="reply-all"
            color='grey'  
            size={24}
            onPress={() => console.log('Reply All pressed')}
          />
          <IconButton
            icon="forward"
            color='grey'  
            size={24}
            onPress={() => console.log('Forward pressed')}
          />
          <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
            <Button
              icon="delete"
              mode="contained"
              onPress={() => console.log('Delete pressed')}
            >
              Delete
            </Button>
          </View>
        </Card.Actions>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  card: {
    marginBottom: 16,
  },
  sender: {
    color: 'grey',
  },
  content: {
    fontSize: 18,
  },
});

export default EmailDetail;

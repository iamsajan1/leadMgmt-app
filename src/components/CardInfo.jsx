import React from 'react';
import {Avatar, Button, Card, Text} from 'react-native-paper';

const LeftContent = props => <Avatar.Icon {...props} icon="folder" />;

const CardInfo = () => {
  return (
    <Card>
      <Card.Title
        title="Card Title"
        subtitle="Card Subtitle"
        left={props => <Avatar.Icon {...props} icon="folder" />}
        right={props => (
          <IconButton {...props} icon="dots-vertical" onPress={() => {}} />
        )}
      />
      <Card.Content>
        <Text variant="titleLarge">Card title</Text>
        <Text variant="bodyMedium">Card content</Text>
      </Card.Content>
      <Card.Cover source={{uri: 'https://picsum.photos/700'}} />
      <Card.Actions>
        <Button>Cancel</Button>
        <Button>Ok</Button>
      </Card.Actions>
    </Card>
  );
};

export default CardInfo;

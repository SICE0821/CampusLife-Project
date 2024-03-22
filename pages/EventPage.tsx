import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {RootStackParam} from '../types/type';

const EventPage : React.FC = () => {
  const navigation : any = useNavigation();
  navigation.setOptions({ tabBarStyle: { display: 'none' } });
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>EventPage</Text>
      <Button title = "글쓰기" onPress={() => navigation.navigate("WritePostPage")}/>
    </View>
  );
};

export default EventPage;
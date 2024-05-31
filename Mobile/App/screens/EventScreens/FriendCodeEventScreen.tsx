import React from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-swiper';

const FriendCodeEventScreen = ({navigation} : any) => {
  return (
    <View style = {styles.container}>
      <Text>친구 코드 이벤트 페이지</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container : {
    flex : 1,
    justifyContent : 'center',
    alignItems : 'center',
  }
});

export default FriendCodeEventScreen;

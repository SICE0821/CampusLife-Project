import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Image, Text, TouchableOpacity, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { UserData } from '../../types/type'
import config from '../../config';

const width = Dimensions.get("window").width;

const SendUserEventDetailScreen = ({route} : any) => {
  return (
    <View style={styles.container}>
      <Text>유저가 보낸 이벤트메세지를 상세 확인 할 수 있다. </Text>
      <Text>여기서 유저에게 이벤트를 줄 수 있다(이벤트 당첨) </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent : 'center'
  },
});

export default SendUserEventDetailScreen;

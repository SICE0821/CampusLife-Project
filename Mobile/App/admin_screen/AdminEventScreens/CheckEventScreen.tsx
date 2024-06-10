import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Image, Text, TouchableOpacity, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { UserData } from '../../types/type'
import config from '../../config';

const width = Dimensions.get("window").width;

const CheckEventScreen = ({route, navigation} : any) => {
  return (
    <View style={styles.container}>
      <Text>현재 진행하고 있는 이벤트를 확인하고, 수정 및 종료 할 수 있는 화면</Text>
      <TouchableOpacity style = {{width : 150, height : 100, backgroundColor : 'yellow', justifyContent : 'center', alignItems : 'center'}} 
                                onPress={() => {navigation.navigate("EventRegistrationScreen")}}>
        <Text>이벤트 등록하러 가기</Text>
      </TouchableOpacity>
      <TouchableOpacity style = {{width : 150, height : 100, backgroundColor : 'pink', justifyContent : 'center', alignItems : 'center'}} 
                                onPress={() => {navigation.navigate("SendUserEventScreen")}}>
        <Text>유저가 보낸 이벤트 확인하러 가기</Text>
      </TouchableOpacity>
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

export default CheckEventScreen;

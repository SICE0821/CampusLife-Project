import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Image, Text, TouchableOpacity, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { UserData } from '../../types/type'
import config from '../../config';

const width = Dimensions.get("window").width;

const SendUserEventScreen = ({route, navigation} : any) => {
  return (
    <View style={styles.container}>
      <Text>유저가 작성한 이벤트들을 목록으로 확인 할 수 있다.</Text>
      <TouchableOpacity style = {{width : 150, height : 100, backgroundColor : 'yellow', justifyContent : 'center', alignItems : 'center'}} 
                                onPress={() => {navigation.navigate("SendUserEventDetailScreen")}}>
        <Text>유저가 작성한 글 상세 확인하기</Text>
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

export default SendUserEventScreen;

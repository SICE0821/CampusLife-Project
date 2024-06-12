import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Image, Text, TouchableOpacity, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
const width = Dimensions.get("window").width;

const ManagementUserScreen = ({route} : any) => {
  return (
    <View style={styles.container}>
      <Text>해당 학교에 재학하고, 이 어플을 사용하는 사용자들의 정보를 한눈에 보여준다.</Text>
      <Text>직급 추가 및 유저의 포인트관리 등 여러 활동을 할 수 있다.</Text>
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

export default ManagementUserScreen;

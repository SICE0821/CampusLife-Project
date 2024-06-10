import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Image, Text, TouchableOpacity, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { UserData } from '../../types/type'
import config from '../../config';

const width = Dimensions.get("window").width;

const CheckRegistItemScreen = ({navigation, route} : any) => {
  return (
    <View style={styles.container}>
      <Text>현제 관리자가 등록한 아이템들이 보인다. 아이템을 선택하면</Text>
      <Text>현아이템에 대한 상세 정보가 모달로 뜨고 수정할 수 있다.</Text>
      <TouchableOpacity style = {{width : 150, height : 100, backgroundColor : 'yellow', justifyContent : 'center', alignItems : 'center'}} 
                                onPress={() => {navigation.navigate("RegisterItemScreen")}}>
        <Text>이벤트 등록하러 가기</Text>
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

export default CheckRegistItemScreen;

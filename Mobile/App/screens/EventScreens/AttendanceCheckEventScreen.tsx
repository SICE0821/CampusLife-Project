import React, { useEffect, useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TouchableHighlight } from 'react-native';

const AttendanceCheckEventScreen = () => {
  return (
    <View>
      <Text>출석 체크 이벤트 페이지</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container : {
    flex : 1,
    justifyContent : 'center',
    alignItems : 'center'
  }
});

export default AttendanceCheckEventScreen;
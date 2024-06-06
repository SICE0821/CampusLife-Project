import React, { useState, useEffect } from 'react';
import { Dimensions, ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import config from '../../config';
import { UserData } from '../../types/type';
import { useFocusEffect } from '@react-navigation/native';

const StudyRoomDetailScreen = ({ route }: any) => {
  return (
    <View style = {styles.container}>
      <Text>스터디룸 디테일</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent : 'center',
    alignItems : 'center'
  },
  
});

export default StudyRoomDetailScreen;

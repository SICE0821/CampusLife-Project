import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Image, Text, TouchableOpacity, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { UserData } from '../../types/type'
import config from '../../config';

const width = Dimensions.get("window").width;

const RegisterItemScreen = ({route} : any) => {
  return (
    <View style={styles.container}>
      <Text>여기서 관리자가 아이템을 등록하게 된다</Text>
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

export default RegisterItemScreen;

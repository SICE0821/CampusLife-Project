import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Image, Text, TouchableOpacity, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { UserData } from '../../types/type'
import config from '../../config';

const width = Dimensions.get("window").width;

const ReportPostsScreen = ({route} : any) => {
  return (
    <View style={styles.container}>
      <Text>신고된 게시물들을 한곳에서 볼수있다. (게시물 정보 및 작성자, 제목 등등을 표현)</Text>
      <Text>게시물을 클릭하면, 해당 게시물로 이동하며, 게시글 삭제 및, 댓글 삭제 기능을 사용할 수 있다.</Text>
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

export default ReportPostsScreen;

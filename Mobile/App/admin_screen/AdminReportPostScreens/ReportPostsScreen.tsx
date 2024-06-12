import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Image, Text, TouchableOpacity, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { UserData } from '../../types/type'
import config from '../../config';

type ReportUser = {
  report_id: number,
      post_title: string,
      contents: string,
      date: Date,
      view: number,
      like: number,
      user_title: string,
      name: string,
      campus_id: string,
      department_name: string
}

const width = Dimensions.get("window").width;

const ReportPostsScreen = ({route} : any) => {
  const [userReport, setUserReport] = useState<ReportUser[]>([]); //포스터에 대한 정보.

  const get_user_report = async () => {
    try {
        const response = await fetch(`${config.serverUrl}/getReportInfo`, {
            method: 'GET', // GET 요청으로 수정
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        setUserReport(data);
        return data;
    } catch (error) {
        console.error('값 가져오기 실패:', error);
    }
  }
  
  useEffect(() => {
    get_user_report();
  }, []);

  console.log(userReport)

  return (
    <View style={styles.container}>
      <Text>신고된 게시물들을 한곳에서 볼수있다. (게시물 정보 및 작성자, 제목 등등을 표현)</Text>
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

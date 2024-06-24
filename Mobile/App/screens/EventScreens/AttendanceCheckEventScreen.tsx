import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Image, Text, TouchableOpacity, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { UserData } from '../../types/type'
import config from '../../config';

const width = Dimensions.get("window").width;


const AttendanceCheckEventScreen = ({route} : any) => {
  const { userdata } = route.params;
  const [userData, setUserData] = useState<UserData>(userdata);
  const [attendanceChecked, setAttendanceChecked] = useState(false);
  const [selectedDates, setSelectedDates] : any = useState([]);
  //console.log(userdata);
  useFocusEffect(
    React.useCallback(() => {
        setUserData(userdata);
        getAppAttendanceDate();
    }, [])
);

  const getAppAttendanceDate = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/getAppAttendanceDate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.user_pk
        }),
      })
      const AppAttendanceDate = await response.json();
      //console.log(AppAttendanceDate);
      const checkdate = AppAttendanceDate.map((item : any) => item.date);
      setSelectedDates(checkdate);
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  const addAppAttendanceDate = async (today : any) => {
    try {
      const response = await fetch(`${config.serverUrl}/addAppAttendanceDate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.user_pk,
          date : today
        }),
      })
      await getAppAttendanceDate();
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  const user_update_point = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/user_update_point_2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id : userData.user_pk,
          point : 10
        })
      })
      //console.log("포인트 올리기 성공")
      userData.point = userData.point + 10
    } catch (error) {
      console.error('포인트 올리기 실패', error);
    }
  }


  const markedDates: { [date: string]: { marked: boolean; selected?: boolean } } = selectedDates.reduce((acc: { [date: string]: { marked: boolean; selected?: boolean } }, date: string) => {
    acc[date] = { marked: true, selected: true };
    return acc;
  }, {});

  const handleAttendanceCheck = async () => {
    const today = new Date().toISOString().split('T')[0];
    //console.log(today);

    if (selectedDates.includes(today)) {
      Alert.alert('이미 출석체크를 하셨습니다.');
    } else {
      setAttendanceChecked(true);
      addAppAttendanceDate(today);
      user_update_point();
      Alert.alert(
        "앱 출석체크 성공!!",
        "앱 출석체크 성공!! 10포인트가 적립되었습니다.",
        [
          { text: "확인" }
        ]
      );
    }
  };

  const renderImage = () => (
    <Image
      source={require('../../assets/selected.png')}
      style={styles.selectedImage}
    />
  );

  
const AttendanceCheckEvent = require('../../assets/AttendanceCheckEvent.jpg');

  return (
    <View style={styles.container}>
      <Image source={AttendanceCheckEvent} style={{ flex:1, width: '100%', resizeMode: 'contain',}}/>
      <View style={styles.topInfo}>
        <Text style={styles.pointText}>현재 포인트 : {userData.point}P</Text>
      </View>
      <Calendar
        style={styles.calendar}
        theme={{
          todayTextColor: 'black',
          textDayFontSize: 20,
          textDayFontWeight: 'bold',
          textMonthFontSize: 20,
          textMonthFontWeight: 'bold',
          textSectionTitleColor: 'black',
        }}
        monthFormat={'M월'}
        showSixWeeks={true}
        markedDates={markedDates}
        markingType={'custom'}
        dayComponent={({ date, state }: any) => {
          const marked = markedDates[date.dateString];
          return (
            <View style={styles.dayContainer}>
              <Text
                style={[
                  styles.dayText,
                  state === 'disabled' ? styles.disabledText : null,
                  marked && styles.selectedText, // 선택된 날짜에 대한 텍스트 스타일 적용
                ]}
              >
                {date.day}
              </Text>
              {marked && renderImage()}
            </View>
          );
        }}
      />
      <TouchableOpacity onPress={async () => {
        handleAttendanceCheck();
        getAppAttendanceDate();}}>
        <View style={styles.buttonArea}>
          <Text style={styles.buttonText}>출석체크</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  topInfo: {
    alignItems: 'center',
    //backgroundColor: 'red',
    padding: 15
  },
  pointText: {
    color: 'black',
    fontSize: 26,
    fontWeight: 'bold'
  },
  calendar: {
    width: width - 10,
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: '#E9E9E9',
    borderRadius: 20,
    elevation: 10,
  },
  selectedImage: {
    width: 35,
    height: 35,
    position: 'absolute',
  },
  dayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    position: 'relative',
  },
  dayText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  selectedText: {
    color: 'white', // 선택된 날짜의 텍스트 색상
  },
  disabledText: {
    color: 'gray',
  },
  buttonArea: {
    marginVertical: 30,
    backgroundColor: 'orange',
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    elevation: 3,
  },
  buttonText: {
    color: 'black',
    fontSize: 26,
    fontWeight: 'bold'
  }
});

export default AttendanceCheckEventScreen;

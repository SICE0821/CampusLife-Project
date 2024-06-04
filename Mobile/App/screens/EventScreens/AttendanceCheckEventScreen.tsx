import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Image, Text, TouchableOpacity, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';

const width = Dimensions.get("window").width;

const myPoint = 50;

const AttendanceCheckEventScreen = () => {
  const [attendanceChecked, setAttendanceChecked] = useState(false);
  const selectedDates = [
    '2024-06-01',
    '2024-06-02',
  ];

  const markedDates: { [date: string]: { marked: boolean; selected?: boolean } } = selectedDates.reduce((acc: { [date: string]: { marked: boolean; selected?: boolean } }, date: string) => {
    acc[date] = { marked: true, selected: true };
    return acc;
  }, {});

  const handleAttendanceCheck = () => {
    const today = new Date().toISOString().split('T')[0];
    if (selectedDates.includes(today)) {
      Alert.alert('이미 출석체크를 하셨습니다.');
    } else {
      setAttendanceChecked(true);
      Alert.alert('출석체크가 완료되었습니다.');
    }
  };

  const renderImage = () => (
    <Image
      source={require('../../assets/selected.png')}
      style={styles.selectedImage}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.topInfo}>
        <Text style={styles.topText}>매일매일 출석체크!</Text>
        <Text style={styles.pointText}>현재 포인트 : {myPoint}P</Text>
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
      <TouchableOpacity onPress={handleAttendanceCheck}>
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
  topText: {
    color: 'black',
    fontSize: 32,
    fontWeight: 'bold'
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

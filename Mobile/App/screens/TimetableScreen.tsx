import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

// 타입 정의
type Course = {
  day: string;
  time: string;
  duration: number;
  course: string;
  professor: string;
  room: string;
  color: string;
};

type TimetableData = {
  [gradeAndSemester: string]: Course[];
};

const TimetableHeader = ({ days }: { days: string[] }) => (
  <View style={[styles.row, styles.headerRow]}>
    <View style={styles.timeColumn}></View>
    {days.map((day, index) => (
      <View key={index} style={styles.cell}>
        <Text style={styles.headerText}>{day}</Text>
      </View>
    ))}
  </View>
);

const TimetableCell = ({ course, professor, room, color }: Course) => (
  <View style={[styles.cell, { backgroundColor: color }]}>
    <Text style={styles.courseText}>{course}</Text>
    <Text style={styles.professorText}>{professor}</Text>
    <Text style={styles.roomText}>{room}</Text>
  </View>
);

const TimetableRow = ({ time, courses, days }: { time: string; courses: Course[]; days: string[] }) => (
  <View style={styles.row}>
    <View style={styles.timeColumn}>
      <Text>{time}</Text>
    </View>
    {days.map((day, index) => {
      const course = courses.find(course => course.day === day && course.time === time);
      if (course) {
        const duration = course.duration;
        return (
          <View key={index} style={[styles.datacell, { height: 60 * duration }]}>
            <TimetableCell {...course} />
          </View>
        );
      } else {
        return <View key={index} style={styles.cell}></View>;
      }
    })}
  </View>
);

const App = () => {
  const [selectedGradeAndSemester, setSelectedGradeAndSemester] = useState('1학년 1학기');

  const days = ['월', '화', '수', '목', '금'];
  const times = Array.from({ length: 10 }, (_, i) => `${i + 9}:00`);

  const timetableData: TimetableData = {
    '1학년 1학기': [
      { day: '월', time: '14:00', duration: 1, course: '진로탐색', professor: '문주영', room: 'PC1', color: '#FFDDC1' },
      { day: '월', time: '15:00', duration: 1, course: '영문기술서이해', professor: 'Ian', room: 'PC4', color: '#FFD700' },
      { day: '화', time: '10:00', duration: 3, course: '정보처리실습', professor: '임제영', room: 'B1110', color: '#FF6347' },
      { day: '화', time: '14:00', duration: 3, course: '소프트웨어원리', professor: '임웅택', room: 'B0608', color: '#ADFF2F' },
      { day: '수', time: '10:00', duration: 3, course: '컴퓨터그래픽', professor: '임제영', room: 'E0416', color: '#40E0D0' },
      { day: '수', time: '14:00', duration: 1, course: '대인관계', professor: '문주영', room: '온라인', color: '#FA8072' },
      { day: '금', time: '10:00', duration: 3, course: '컴퓨터구조', professor: '홍성옥', room: 'B0611', color: '#8A2BE2' },
    ],
    '1학년 2학기': [
      { day: '월', time: '11:00', duration: 2, course: '물리', professor: '박철수', room: 'A102', color: '#FFDDC1' },
      { day: '화', time: '14:00', duration: 3, course: '화학', professor: '김유신', room: 'B202', color: '#FFD700' },
      { day: '수', time: '16:00', duration: 2, course: '생물', professor: '최영희', room: 'B203', color: '#FF6347' },
    ],
    '2학년 1학기': [
      { day: '월', time: '09:00', duration: 2, course: '역사', professor: '정약용', room: 'C101', color: '#ADFF2F' },
      { day: '화', time: '12:00', duration: 3, course: '지리', professor: '안중근', room: 'C201', color: '#40E0D0' },
      { day: '수', time: '14:00', duration: 2, course: '문학', professor: '윤동주', room: 'C301', color: '#FA8072' },
    ],
    '2학년 2학기': [
      { day: '월', time: '10:00', duration: 2, course: '철학', professor: '서재필', room: 'D101', color: '#8A2BE2' },
      { day: '화', time: '13:00', duration: 3, course: '경제', professor: '김구', room: 'D201', color: '#FFDDC1' },
      { day: '수', time: '15:00', duration: 2, course: '정치', professor: '안창호', room: 'D301', color: '#FFD700' },
    ],
    '3학년 1학기': [
      { day: '월', time: '10:00', duration: 2, course: '수학', professor: '홍길동', room: 'A101', color: '#FF6347' },
      { day: '화', time: '13:00', duration: 3, course: '영어', professor: '이순신', room: 'B201', color: '#ADFF2F' },
      { day: '수', time: '15:00', duration: 2, course: '과학', professor: '우규희', room: 'B201', color: '#40E0D0' },
    ],
    '3학년 2학기': [
      { day: '월', time: '11:00', duration: 2, course: '물리', professor: '박철수', room: 'A102', color: '#FA8072' },
      { day: '화', time: '14:00', duration: 3, course: '화학', professor: '김유신', room: 'B202', color: '#8A2BE2' },
      { day: '수', time: '16:00', duration: 2, course: '생물', professor: '최영희', room: 'B203', color: '#FFDDC1' },
    ],
    '4학년 1학기': [],
    '4학년 2학기': [],
  };

  const courses = timetableData[selectedGradeAndSemester];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedGradeAndSemester}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedGradeAndSemester(itemValue)}
        >
          <Picker.Item label="1학년 1학기" value="1학년 1학기" />
          <Picker.Item label="1학년 2학기" value="1학년 2학기" />
          <Picker.Item label="2학년 1학기" value="2학년 1학기" />
          <Picker.Item label="2학년 2학기" value="2학년 2학기" />
          <Picker.Item label="3학년 1학기" value="3학년 1학기" />
          <Picker.Item label="3학년 2학기" value="3학년 2학기" />
          <Picker.Item label="4학년 1학기" value="4학년 1학기" />
          <Picker.Item label="4학년 2학기" value="4학년 2학기" />
        </Picker>
      </View>
      <View style={styles.table}>
        <TimetableHeader days={days} />
        {times.map((time, index) => (
          <TimetableRow key={index} time={time} courses={courses} days={days} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    margin: 10,
  },
  picker: {
    flex: 0.5,
    height: 50,
  },
  table: {
    flexDirection: 'column',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    height: 60,
  },
  timeColumn: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  datacell: {
    flex: 1,
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  headerRow: {
    backgroundColor: '#f0f0f0',
  },
  headerText: {
    fontWeight: 'bold',
  },
  courseText: {
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
    color: 'black',
  },
  professorText: {
    fontSize: 12,
    color: 'black',
    //fontStyle: 'italic',
  },
  roomText: {
    fontSize: 12,
    color: 'black'
  },
});

export default App;

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { UserData , Lecture } from '../types/type';

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
      <Text style={{color: 'gray'}}>{time}</Text>
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

const originalColors = ['#7469B6', '#AD88C6', '#E1AFD1', '#FFE6E6', '#FFF9D0', '#CAF4FF', '#A0DEFF', '#5AB2FF', '#40A578', '#9DDE8B'];
let usedColors: string[] = [];

const getRandomColor = (): string => {
  // Reset colors if all colors are used
  if (usedColors.length === originalColors.length) {
    usedColors = [];
  }

  // Get available colors
  const availableColors = originalColors.filter(color => !usedColors.includes(color));
  const randomIndex = Math.floor(Math.random() * availableColors.length);
  const color = availableColors[randomIndex];

  // Mark color as used
  usedColors.push(color);
  return color;
};


const formatTime = (time: string): string => {
  // 시간과 분을 추출
  const [hourString, minuteString] = time.split(':');
  const hour = parseInt(hourString);
  const minute = parseInt(minuteString);

  // 시간과 분이 유효한지 확인
  if (isNaN(hour) || isNaN(minute)) {
    // 유효하지 않은 경우 기본값으로 리턴
    return '00:00';
  }

  // 시간과 분을 기반으로 새로운 시간을 생성
  const newHour = hour < 10 ? `0${hour}` : `${hour}`;
  const newTime = `${newHour}:00`; // 항상 분을 00으로 설정

  return newTime;
};

const App = ({ route }: any) => {
  const [selectedGradeAndSemester, setSelectedGradeAndSemester] = useState('1학년 1학기');
  const { userdata, LectureData } = route.params;
  const [userData, setUserData] = useState<UserData>(userdata);
  const [userLecture, setUserLecture] = useState<Lecture>(LectureData);
  const [semesters, setSemesters] = useState<string[]>([]);
  

  const days = ['월요일', '화요일', '수요일', '목요일', '금요일'];
  const times = Array.from({ length: 10 }, (_, i) => `${i + 9}:00`);

  const timetableData: TimetableData = {};
  
  userLecture.forEach((lecture: Lecture) => {
    const semesterKey = `${lecture.lecture_grade}학년 ${lecture.lecture_semester}학기`;

    if (!timetableData[semesterKey]) {
      timetableData[semesterKey] = []; // Initialize as an empty array if undefined
    }

    timetableData[semesterKey].push({
      day: lecture.week,
      time: formatTime(lecture.lecture_time),
      duration: lecture.credit,
      course: lecture.lecture_name,
      professor: lecture.professor_name,
      room: lecture.lecture_room,
      color: getRandomColor(),
    });
  });

  useEffect(() => {
    // Generate the list of semesters based on college value
    const generateSemesters = (college: number): string[] => {
      const allSemesters = [
        '1학년 1학기',
        '1학년 2학기',
        '2학년 1학기',
        '2학년 2학기',
        '3학년 1학기',
        '3학년 2학기',
        '4학년 1학기',
        '4학년 2학기',
      ];
      return allSemesters.slice(0, college * 2);
    };

    setSemesters(generateSemesters(userData.college));
  }, [userData]);

  const courses = timetableData[selectedGradeAndSemester] || [];


  return (
    <ScrollView style={styles.container}>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedGradeAndSemester}
          dropdownIconColor={'black'}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedGradeAndSemester(itemValue)}
        >
          {semesters.map((semester, index) => (
            <Picker.Item key={index} label={semester} value={semester} />
          ))}
        </Picker>
      </View>
      <View style={styles.table}>
        <TimetableHeader days={days} />
        {times.map((time, index) => (
          <TimetableRow key={index} time={time} courses={courses} days={days} />
        ))}
      </View>
      <View style={{height: 100}}>

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
    color: 'black',
    borderWidth: 5,
    backgroundColor: 'white',
    elevation: 5,
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
    color: 'gray'
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
    color: 'black',
  },
});

export default App;

import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';

const TimetableHeader = ({ days }: any) => (
  <View style={[styles.row, styles.headerRow]}>
    <View style={styles.timeColumn}></View>
    {days.map((day: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, index: React.Key | null | undefined) => (
      <View key={index} style={styles.cell}>
        <Text style={styles.headerText}>{day}</Text>
      </View>
    ))}
  </View>
);

const TimetableCell = ({ course, professor, room } : any) => (
  <View style={styles.cell}>
    <Text>{course}</Text>
    <Text>{professor}</Text>
    <Text>{room}</Text>
  </View>
);

const TimetableRow = ({ time, courses, days } : any) => (
  <View style={styles.row}>
    <View style={styles.timeColumn}>
      <Text>{time}</Text>
    </View>
    {days.map((day: any, index: React.Key | null | undefined) => {
      const course = courses.find((course: { day: any; time: any; }) => course.day === day && course.time === time);
      if (course) {
        // 강의가 있는 경우, 강의 시간에 따라 높이를 동적으로 조절합니다.
        const duration = course.duration === 3 ? 3 : 2;
        return (
          <View key={index} style={[styles.datacell, { 
            height: 60 * duration }]}>
            <TimetableCell {...course} />
          </View>
        );
      } else {
        // 강의가 없는 경우, 빈 셀을 표시합니다.
        return <View key={index} style={styles.cell}></View>;
      }
    })}
  </View>
);

const App = () => {
  const days = ['월', '화', '수', '목', '금']; // 요일 데이터
  const times = Array.from({ length: 10 }, (_, i) => `${i + 9}:00`); // 시간 데이터
  const timetableData = [
    { day: '월', time: '10:00', duration: 2, course: '수학', professor: '홍길동', room: 'A101' },
    { day: '화', time: '13:00', duration: 3, course: '영어', professor: '이순신', room: 'B201' },
    // 이하 시간표 데이터
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.table}>
        <TimetableHeader days={days} />
        {times.map((time, index) => (
          <TimetableRow key={index} time={time} courses={timetableData} days={days} />
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
  table: {
    flexDirection: 'column',
    flex: 1,
    marginHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    height: 60
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
    margin: 1,
    backgroundColor:'red'
  },
  cell: {
    flex: 1,
    //padding: 10,
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
});

export default App;

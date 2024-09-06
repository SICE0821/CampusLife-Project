import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { UserData, TimeTableLecture } from '../types/type';
import ModalSelector from 'react-native-modal-selector';
import ModalBox from 'react-native-modalbox';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

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

// 드롭다운에 표시할 데이터
const data = [
  { key: 1, label: '월요일' },
  { key: 2, label: '화요일' },
  { key: 3, label: '수요일' },
  { key: 4, label: '목요일' },
  { key: 5, label: '금요일' },

];


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
  //시간 표시 부분
  <View style={styles.row}>
    <View style={styles.timeColumn}>
      <Text style={{ color: 'gray' }}>{time}</Text>
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
  const [userLecture, setUserLecture] = useState<TimeTableLecture[]>([]);
  const [semesters, setSemesters] = useState<string[]>([]);
  const [timetableData, setTimetableData] = useState<TimetableData>({});
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달의 열기/닫기 상태를 useState로 관리
  const [lectureName, setLectureName] = useState(''); //강의 이름
  const [professorName, setProfessorName] = useState(''); //교수 이름
  const [spaceName, setSpaceName] = useState(''); //교수 이름
  const [credit, setCredit] = useState(''); //학점
  const [day, setDay] = useState(''); //요일 드롭다운 메뉴
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
  const [selectedTime, setSelectedTime] = useState('시작 시간 선택'); //수업시작 시간
  const [selectedTime2, setSelectedTime2] = useState('종료 시간 선택'); //수업종료 시간

  const days = ['월요일', '화요일', '수요일', '목요일', '금요일'];
  const times = Array.from({ length: 10 }, (_, i) => `${i + 9}:00`);

  const openModal = async () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const showDatePicker2 = () => {
    setDatePickerVisibility2(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const hideDatePicker2 = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (time: any) => {
    // 선택된 시간을 처리하는 로직
    const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSelectedTime(formattedTime);
    hideDatePicker();
  };

  const handleConfirm2 = (time: any) => {
    // 선택된 시간을 처리하는 로직
    const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSelectedTime2(formattedTime);
    hideDatePicker2();
  };


  //여기서 userLecture에 값을 변화 시킬때마다 테이블을 다시 랜더링 해줄거야
  useEffect(() => {
    // 새로운 timetableData 객체 생성
    const newTimetableData: TimetableData = {};
    // userLecture 배열을 순회하여 데이터 정제
    userLecture.forEach((lecture: any) => {
      // 학년과 학기를 semesterKey로 사용
      const semesterKey = `${lecture.lecture_grade}학년 ${lecture.lecture_semester}학기`;

      // timetableData에서 해당 학기 key가 없으면 초기화
      if (!newTimetableData[semesterKey]) {
        newTimetableData[semesterKey] = [];
      }

      // 정제된 데이터를 timetableData에 추가
      newTimetableData[semesterKey].push({
        day: lecture.week, //
        time: formatTime(lecture.lecture_time), //
        duration: lecture.credit, //
        course: lecture.lecture_name, //
        professor: lecture.professor_name,//
        room: lecture.lecture_room, //
        color: getRandomColor(),
      });
    });

    // 새로 생성된 timetableData를 상태로 저장
    setTimetableData(newTimetableData);
  }, [userLecture]); // userLecture가 변경될 때마다 실행



  //이 함수로 새로운 배열을 집어 넣을거야
  const addLecture = (newLecture: any) => {
    setUserLecture((prevLectures) => [...prevLectures, newLecture]);
  };


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
      <View style={styles.buttonspace}>
        <TouchableOpacity style={styles.instertTablebutton}>
          <Text style={styles.instertTablebuttonFont}
            onPress={() => openModal()}>
            시간표 추가 하기
          </Text>
        </TouchableOpacity>
      </View>
      <ModalBox
        isOpen={isModalOpen}
        style={styles.modal}
        position="bottom"
        swipeToClose={false}
        onClosed={closeModal}
      >
        <View style={styles.modalContent}>
          <View style={{ height: "5%" }}></View>
          <View style={styles.lecture_room_container}>
            <TextInput
              style={styles.input}
              placeholder="강의명"
              placeholderTextColor={'gray'}
              maxLength={800}
              multiline={true}
              value={lectureName}
              onChangeText={setLectureName}
            />
          </View>
          <View style={{ height: "5%" }}></View>
          <View style={styles.lecture_room_container}>
            <TextInput
              style={styles.input}
              placeholder="교수명"
              placeholderTextColor={'gray'}
              value={professorName}
              onChangeText={setProfessorName}
            />
          </View>
          <View style={{ height: "5%" }}></View>
          <View style={styles.day_time_container}>
            <ModalSelector
              data={data}
              initValue="요일 선택"
              onChange={(option) => setDay(option.label)} // 항목 선택 시 상태 업데이트
              style={styles.day_Modal}
              initValueTextStyle={{
                color: 'gray',
              }}
              selectedItemTextStyle={{
                color: 'black',
                fontSize: 18,
                fontWeight: 'bold',
              }}
              selectStyle={{
                backgroundColor: '#f5f5f5',
                borderRadius: 8,
              }}
              optionTextStyle={{
                color: '#000',
                fontSize: 16,
              }}
            >
            </ModalSelector>
            <View style={styles.time_section}>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => { showDatePicker() }}>
                  <Text style={styles.before_time_Text}>{selectedTime}</Text>
                </TouchableOpacity>
                <View style={{ width: "3%" }}></View>
                <Text style={{ marginTop: 10, fontSize: 20 }}>
                  ~
                </Text>
                <View style={{ width: "3%" }}></View>
                <TouchableOpacity onPress={() => { showDatePicker2() }}>
                  <Text style={styles.after_time_Text}>{selectedTime2}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="time"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              is24Hour={true}
            />
            <DateTimePickerModal
              isVisible={isDatePickerVisible2}
              mode="time"
              onConfirm={handleConfirm2}
              onCancel={hideDatePicker2}
              is24Hour={true}
            />
          </View>
          <View style={styles.container2}>
            <View style={{ width: "50%" }}>
              <TextInput
                style={styles.input2}
                placeholder="장소"
                placeholderTextColor={'gray'}
                value={spaceName}
                onChangeText={setSpaceName}
              />
            </View>
            <View style ={{width : "50%"}}>
            <TextInput
                style={styles.input2}
                placeholder="과목 학점(숫자만) :"
                placeholderTextColor={'gray'}
                value={credit}
                onChangeText={setCredit}
              />
            </View>
          </View>
          <View style = {styles.completeSection}>
              <TouchableOpacity style = {styles.completeButton}>
                <Text style = {styles.completebuttonFont}>등록</Text>
              </TouchableOpacity>
          </View>
        </View>
      </ModalBox>
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
  buttonspace: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  instertTablebutton: {
    height: '50%',
    width: '40%',
    backgroundColor: '#F27400',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  instertTablebuttonFont: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold'
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '50%',
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20
  },
  lecture_room_container: {
    height: '15%',
    borderBottomWidth: 1
  },

  container2: {
    height: '15%',
    flexDirection: 'row',
  },
  input: {
    width: '90%',
    color: 'black', // 입력 텍스트 색상
    fontSize: 18,
  },

  input2: {
    width: '90%',
    color: 'black', // 입력 텍스트 색상
    fontSize: 18,
    borderBottomWidth : 1
  },
  day_time_container: {
    height: '15%',
    flexDirection: 'row'
  },
  day_Modal: {
    borderRadius: 10,
    width: '20%',
    height: '75%',
    borderWidth: 2,
    borderColor: 'grey'
  },
  time_section: {
    width: '100%',
    height: '100%',
    //flexDirection: 'row',
    // backgroundColor: 'green'
  },
  before_time_Text: {
    fontSize: 20,
    color: 'black',
    marginTop: 10,
    marginLeft: 10,
  },
  after_time_Text: {
    fontSize: 20,
    color: 'black',
    marginTop: 10,
  },
  completeSection: {
    height : "20%",
    //backgroundColor : 'red',
    justifyContent : 'center',
    alignItems : 'center'
  },
  completeButton: {
    width : "30%",
    height : "50%",
    justifyContent : 'center',
    alignItems : 'center',
    backgroundColor : "#F27400",
    borderRadius : 10,
    marginTop : 40
  },
  completebuttonFont : {
    fontSize : 16,
    color : 'white',
    fontWeight : 'bold'
  }
});

export default App;

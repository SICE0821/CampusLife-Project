import React, {useState, useEffect} from 'react';
import { Alert, SafeAreaView, View, Text, Button, StyleSheet, TouchableOpacity, ScrollView, Dimensions} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ModalBox from 'react-native-modalbox';
import Modal from 'react-native-modal';
import IconA from 'react-native-vector-icons/FontAwesome5';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { Camera,
  useCameraDevice, 
  useCameraPermission, 
  useCodeScanner } from 'react-native-vision-camera';
import { UserData, Lecture } from '../../types/type'
import config from '../../config';

const AttendanceScreen = ({navigation, route}: any) => {
  const { userdata, LectureData } = route.params;
  const [userData, setUserData] = useState<UserData>(userdata);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달의 열기/닫기 상태를 useState로 관
  const { hasPermission, requestPermission } = useCameraPermission()
  const [isCameraButton, setIsCameraButton] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [lectureList, setLectureList] = useState<Lecture[]>([]);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [lastScannedTime, setLastScannedTime] = useState<null | Date>(null);
  const [isScanned, setIsScanned] = useState(false); // QR 코드가 스캔되었는지 추적
  

  const filterLectures = (lectures: Lecture[]) => {
    return lectures.filter(
      (lecture) =>
        lecture.lecture_grade === userData.grade &&
        lecture.lecture_semester === userData.student_semester
    );
  };
  

  const getCurrentDate = () => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate() ;
    const day = days[now.getDay() ];

    return `${year}년 ${month}월 ${date}일 ${day}요일`;
  };
  

  const getCurrentDay = () => {
    const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const now = new Date();
    return days[now.getDay()]; // 현재 요일 반환
  };

  const nowday = getCurrentDay();

  const formatTimeRange = (lectureTime: string) => {
    return lectureTime.split(' ~ ');
  };

  const generateTimeRanges = (lectureTime: string) => {
    const [start, end] = formatTimeRange(lectureTime);
    const timeRanges = [];
    
    let [currentHour, currentMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
  
    while (!(currentHour === endHour && currentMinute === endMinute)) {
      if (currentMinute % 10 !== 0) {
        currentMinute = Math.ceil(currentMinute / 10) * 10;
      }
  
      const startHourStr = currentHour < 10 ? `0${currentHour}` : `${currentHour}`;
      const startMinuteStr = currentMinute < 10 ? `0${currentMinute}` : `${currentMinute}`;
  
      let nextHour = currentHour;
      let nextMinute = currentMinute + 50;
  
      if (nextMinute >= 60) {
        nextHour++;
        nextMinute -= 60;
      }
  
      if (nextHour > endHour || (nextHour === endHour && nextMinute > endMinute)) {
        break;
      }
  
      const nextHourStr = nextHour < 10 ? `0${nextHour}` : `${nextHour}`;
      const nextMinuteStr = nextMinute < 10 ? `0${nextMinute}` : `${nextMinute}`;
  
      const nextTime = `${startHourStr}:${startMinuteStr} ~ ${nextHourStr}:${nextMinuteStr}`;
      timeRanges.push(nextTime);
  
      currentHour = nextHour;
      currentMinute = nextMinute;
  
      currentMinute += 10;
      if (currentMinute >= 60) {
        currentHour++;
        currentMinute -= 60;
      }
    }
  
    return [...timeRanges]; 
  };

  const updateAttendanceStatus = async (lecture: Lecture) => {
    const periods = generateTimeRanges(lecture.lecture_time).length;
    const updatedLectureList = lectureList.map((lec) => {
      if (lec.lecture_name === lecture.lecture_name) {
        return {
          ...lec,
          nonattendance: lec.nonattendance - periods,
          attendance: lec.attendance + periods,
          weeknum : lec.weeknum + 1,
        };
      }
      return lec;
    });
    setLectureList(updatedLectureList);
    await Updatelecture(updatedLectureList); 
  };
  

  const Updatelecture = async (lecture: Lecture[]) => {
    try {
      const promises = lecture.map(async (lec) => {
        const response = await fetch(`${config.serverUrl}/updatelecture`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            student_id: userData.student_pk,
            lecture_id : lec.lecture_id,
            nonattendance: lec.nonattendance,
            attendance: lec.attendance,
            tardy: lec.tardy,
            absent: lec.absent,
            weeknum : lec.weeknum
          }),
        });
        const data = await response.json();

        console.log("출석 정보 업데이트 성공:", data);
        
      });
  
      await Promise.all(promises);
    } catch (error) {
      console.log('출석 정보 업데이트 실패:', error);
    }
  };
  
  const openModal = (lecture: Lecture) => {
    setSelectedLecture(lecture);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsCameraButton(false); // 모달을 닫을 때 카메라 버튼 상태도 false로 변경합니다.
  };

  const openCamera = (lecture: Lecture) => {
    const currentTime = new Date().getTime();
    if (isScanned && lastScannedTime && (currentTime - new Date(lastScannedTime).getTime()) < (24 * 60 * 60 * 1000) ) {
      Alert.alert(
        '출석 처리됨',
        '이미 출석 처리가 완료되었습니다. 하루에 한 번만 출석할 수 있습니다.',
        [{ text: '확인' }],
        { cancelable: false }
      );
    } else {
      setIsScanned(false);
      setIsCameraButton(true);
    }
  };

  React.useEffect(() =>{
    requestPermission();
  }, [])
  
  React.useEffect(() => {
    if (isCameraButton) {
      navigation.navigate('FullScreenCamera');
      closeModal();
    }
  }, [isCameraButton]);

  useEffect(() => {
    setScannedCode(route.params?.scannedCode);
  }, [route.params?.scannedCode]);

  useEffect(() => {
    const filteredLectures = filterLectures(LectureData);
    setLectureList(filteredLectures);
    if (scannedCode && selectedLecture) {
    setLastScannedTime(new Date());
    setIsScanned(true);
    Alert.alert(
      'QR 코드 스캔됨',
      `스캔된 코드: ${scannedCode}`,
      [{ text: '확인', onPress: () => updateAttendanceStatus(selectedLecture) }],
      { cancelable: false }
    );
  }
}, [scannedCode, LectureData]);


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>오늘의 출석</Text>
        <Text style={styles.date}>{getCurrentDate()}</Text>
      </View>

      {lectureList.map((Lecture, index) => (
        Lecture.week === nowday && (
          <View key={index} style={styles.buttonContainer}>
            <TouchableOpacity style={styles.AttendanceList} onPress={() => openModal(Lecture)}>
              <Text style={styles.ListText}>{Lecture.lecture_name}</Text>
              <Text style={styles.ListInfo}>{Lecture.professor_name} | {Lecture.lecture_room}               미출결: {Lecture.nonattendance} 출결: {Lecture.attendance} 지각: {Lecture.tardy} 결석: {Lecture.absent}</Text>
            </TouchableOpacity>
          </View>
        )
      ))}

      <View style={styles.textContainer2}>
        <Text style={styles.title2}>출석 현황</Text>
      </View>
      {lectureList.map((Lecture, index) => (
        Lecture.week !== nowday && (
          <View key={index} style={styles.buttonContainer2}>
            <TouchableOpacity style={styles.AttendanceList} onPress={() => openModal(Lecture)}>
              <Text style={styles.ListText}>{Lecture.lecture_name}</Text>
              <Text style={styles.ListInfo}>{Lecture.professor_name} | {Lecture.lecture_room}              미출결: {Lecture.nonattendance} 출결: {Lecture.attendance} 지각: {Lecture.tardy} 결석: {Lecture.absent}</Text>
            </TouchableOpacity>
          </View>
        )
      ))}
        <ModalBox
          isOpen={isModalOpen && selectedLecture !== null}
          style={styles.modal}
          position="bottom"
          swipeToClose={false}
          onClosed={closeModal}
        >
        {selectedLecture && (
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 0.5 }}>
                <View>
                <Text style={styles.ListText2}>{selectedLecture?.lecture_name}</Text>
                </View>
                  <View style={styles.Icon}>
                  <TouchableOpacity onPress={() => openCamera(selectedLecture)} disabled={nowday !== selectedLecture?.week}>
                    <IconA name="camera" size={32} color={nowday === selectedLecture?.week ? "black" : "gray"} />
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <View>
                  <Text style={styles.ListInfo2}>미출결: {selectedLecture?.nonattendance}  출결: {selectedLecture?.attendance}  지각: {selectedLecture?.tardy}  결석: {selectedLecture?.absent}</Text>
                </View>
              </View>
            </View>
            <View style={styles.WeekContainer}>
              <ScrollView>
                {[...Array(15)].map((_, weekIndex) => (
                  <View key={weekIndex}>
                    <View style={styles.Week}>
                      <Text style={{ fontSize: 20, marginTop : 5,fontWeight: 'bold', color: 'black' }}>{weekIndex + 1}주차</Text>
                    </View>
                    <View style={styles.View}>
                      {generateTimeRanges(selectedLecture.lecture_time).map((timeRange, index) => (
                        <View key={index} style={styles.Include}>
                          <View style={styles.Attendance}>
                            <Text style={styles.timeText}>{index + 1}차시            {timeRange}</Text>
                          </View>
                          <View style={styles.Box}>
                            <View style={[styles.realBox, { backgroundColor: weekIndex < selectedLecture.weeknum ? "#228B22" : "#909090" }]}>
                            </View>
                          </View>
                        </View>
                        
                      ))}
                    </View>
                  </View>
                  
                ))}
              </ScrollView>
            </View>
            <View style = {{backgroundColor:"white" , height : 100, }}></View>
          </View>
        )}
        </ModalBox>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { // 컨테이너 전체를 담당
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white'
  },
  textContainer: { // 오늘의 출석, 날짜 텍스트 컨테이너
    justifyContent: 'center',
    top: 40,
    marginRight : 200,
    marginBottom : 60,
  },
  textContainer2:{ // 출석 현황 텍스트 컨테이너
    alignItems: 'center',
    justifyContent: 'center',
    marginRight : 250,
    marginTop : 10,
    marginBottom : 15,
  },
  title: { // 오늘의 출석 텍스트 css
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft : 5,
    color : 'black',
  },
  title2: { // 출석 현황 텍스트 css
    fontSize: 25,
    fontWeight: 'bold',
    marginRight : 40,
    color : 'black',
  },
  date: { // 날짜 텍스트 css
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft : 6,
  },
  buttonContainer: { // 오늘의 출석 버튼 컨테이너
    justifyContent: 'flex-start',
  },
  buttonContainer2: { // 출석 현황 버튼 컨테이너
    marginTop : 5,
    justifyContent: 'flex-start',
    
  },
  AttendanceList: { // 과목마다의 버튼 
    borderBottomWidth: 2,
    marginBottom : 8,
    borderColor: 'black',
    width: 395,
  },
  ListText: { // 과목명 텍스트
    fontSize: 20,
    color: 'black',
    marginBottom: 3,
    fontWeight: 'bold',
    marginLeft: 5,
    
  },
  ListText2: { // 버튼 누른 후 과목명 텍스트
    fontSize: 25,
    marginLeft : 25,
    color:'black',
    fontWeight: 'bold',
    
  },
  ListInfo: { // 과목마다의 출석 텍스트
    fontSize: 15,
    marginLeft: 5,
    marginBottom: 5,
    
  },
  ListInfo2: { // 버튼 누른 후 과목마다의 출석 텍스트
    fontSize: 15,
    marginLeft: 25,
    marginTop : 5,
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 600,
    backgroundColor: 'white', // 모달 배경색
    shadowColor: '#000', // 그림자 색상
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContainer:{
    flex : 1,
    borderTopLeftRadius : 20,
    borderTopRightRadius : 20,
    //backgroundColor : 'black',
  },
  header: {
    flex: 0.2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomWidth: 2,
    justifyContent: 'center',
    alignContent: 'center',
  },
  Week: {
    flex: 0.09,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    backgroundColor: '#FCC3A2', // 헤더 배경색
    borderBottomWidth: 2,
    height: 45,
    paddingLeft: 25,
  },
  WeekContainer:{
    flex : 0.8,
  },
  View:{
    flex : 0.91,
  },
  Attendance : {
    flex : 0.9,
    fontSize : 17,
    fontWeight : 'bold',
    color : 'black',
    justifyContent : "center",
  },
  Box:{
    flex : 0.1,
    paddingRight : 12,
    justifyContent : "center",
    alignItems : "center",
  },
  Include: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    flex: 0.13,
    backgroundColor: 'white', // 각 시간표 항목 배경색
  },
  Include2:{
    flexDirection : 'row',
    
  },
  realBox:{
    width : 25,
    height : 25,
    backgroundColor :'#909090',
    margin : 10,
    borderColor : 'black',
    borderWidth : 1,
  },
  timeText:{
    fontSize: 17, 
    fontWeight: 'bold', 
    color: 'black', 
    marginLeft: 28,
    marginBottom : 5,
  },
  Icon:{
    marginRight : 20,
  }
});

export default AttendanceScreen;
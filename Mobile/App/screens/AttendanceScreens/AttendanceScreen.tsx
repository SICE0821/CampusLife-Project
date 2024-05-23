import React, {useState, useEffect} from 'react';
import { Alert, SafeAreaView, View, Text, Button, StyleSheet, TouchableOpacity, ScrollView, Dimensions} from 'react-native';
import ModalBox from 'react-native-modalbox';
import Modal from 'react-native-modal';
import IconA from 'react-native-vector-icons/FontAwesome5';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { Camera,
  useCameraDevice, 
  useCameraPermission, 
  useCodeScanner } from 'react-native-vision-camera';

type Lecture = {
    credit : number;
    professor_name : string;
    lecture_name : string;
    lecture_room : string;
    lecture_time : string;
    week : string;
}

const AttendanceScreen = ({navigation, route}: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달의 열기/닫기 상태를 useState로 관리
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { hasPermission, requestPermission } = useCameraPermission()
  const [isCameraButton, setIsCameraButton] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [lectureList, setLectureList] = useState<Lecture[]>([]);
  const [modalLectureName, setModalLectureName] = useState<string>('');
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  

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
    const days = ['월요일', '화요일', '수요일', '목요일', '금요일'];
    const now = new Date();
    return days[now.getDay() - 1]; // 현재 요일 반환
  };

  const formatTimeRange = (lectureTime: string) => {
    return lectureTime.split(' ~ ');
  };

  const generateTimeRanges = (lectureTime: string) => {
    const [start, end] = formatTimeRange(lectureTime);
    const timeRanges = [];
    
    let [currentHour, currentMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
  
    while (!(currentHour === endHour && currentMinute === endMinute)) {
      // 시작 시간을 10분 단위로 반올림
      if (currentMinute % 10 !== 0) {
        currentMinute = Math.ceil(currentMinute / 10) * 10;
      }
  
      // 시간 형식 맞추기
      const startHourStr = currentHour < 10 ? `0${currentHour}` : `${currentHour}`;
      const startMinuteStr = currentMinute < 10 ? `0${currentMinute}` : `${currentMinute}`;
  
      let nextHour = currentHour;
      let nextMinute = currentMinute + 50; // 50분 간격
  
      // 시간을 60분 단위로 조정
      if (nextMinute >= 60) {
        nextHour++;
        nextMinute -= 60;
      }
  
      // 종료 시간에 도달하면 반복 종료
      if (nextHour > endHour || (nextHour === endHour && nextMinute > endMinute)) {
        break;
      }
  
      const nextHourStr = nextHour < 10 ? `0${nextHour}` : `${nextHour}`;
      const nextMinuteStr = nextMinute < 10 ? `0${nextMinute}` : `${nextMinute}`;
  
      const nextTime = `${startHourStr}:${startMinuteStr} ~ ${nextHourStr}:${nextMinuteStr}`;
      timeRanges.push(nextTime);
  
      // 다음 시간대의 시작 시간 설정
      currentHour = nextHour;
      currentMinute = nextMinute;
  
      // 이전 시간대의 종료 시간에 10분을 추가하여 다음 시간대의 시작 시간 설정
      currentMinute += 10;
      if (currentMinute >= 60) {
        currentHour++;
        currentMinute -= 60;
      }
    }
  
    return timeRanges;
  };


  const fetchLectureData = async () => {
    try {
      const response = await fetch('http://172.16.108.18:3000/getlecture');
      if (!response.ok) {
        throw new Error('서버 응답 실패');
      }
      const data = await response.json();
      setLectureList(data); // 서버로부터 받은 강의 목록을 상태에 저장
    } catch (error) {
      console.error('데이터를 가져오는 중 오류 발생:', error);
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

  const openCamera = () => {
    setIsCameraButton(true);
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
    if (scannedCode) {
      Alert.alert(
        'QR 코드 스캔됨',
        `스캔된 코드: ${scannedCode}`,
        [
          { text: '확인', onPress: () => console.log('확인 버튼 눌림') }
        ],
        { cancelable: false }
      );
    }
  }, [scannedCode]);

  useEffect(() => {
    fetchLectureData(); // 페이지가 로드될 때 강의 목록을 가져옴
  }, []);

  const nowday = getCurrentDay();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>오늘의 출석</Text>
        <Text style={styles.date}>{getCurrentDate()}</Text>
      </View>

      {lectureList.map((lecture, index) => (
        lecture.week === nowday && (
          <View key={index} style={styles.buttonContainer}>
            <TouchableOpacity style={styles.AttendanceList} onPress={() => openModal(lecture)}>
              <Text style={styles.ListText}>{lecture.lecture_name}</Text>
              <Text style={styles.ListInfo}>{lecture.professor_name} | {lecture.lecture_room}                    미출결: 45 출결: 0 지각: 0 결석: 0</Text>
            </TouchableOpacity>
          </View>
        )
      ))}

      <View style={styles.textContainer2}>
        <Text style={styles.title2}>출석 현황</Text>
      </View>
      {lectureList.map((lecture, index) => (
        lecture.week !== nowday && (
          <View key={index} style={styles.buttonContainer2}>
            <TouchableOpacity style={styles.AttendanceList} onPress={() => openModal(lecture)}>
              <Text style={styles.ListText}>{lecture.lecture_name}</Text>
              <Text style={styles.ListInfo}>{lecture.professor_name} | {lecture.lecture_room}                   미출결: 45 출결: 0 지각: 0 결석: 0</Text>
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
                  <TouchableOpacity onPress={openCamera}>
                    <IconA name="camera" size={32} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <View>
                  <Text style={styles.ListInfo2}>미출결 : 45  출결 : 0  지각 : 0  결석 : 0</Text>
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
                            <View style={[styles.realBox, { backgroundColor: "#909090" }]}>
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
  modal: { // 모달 창 css
    borderTopLeftRadius : 20,
    borderTopRightRadius : 20,
    height: 600,
  },
  modalContainer:{
    flex : 1,
    borderTopLeftRadius : 20,
    borderTopRightRadius : 20,
    //backgroundColor : 'black',
  },
  header :{
    flex : 0.2,
    borderTopLeftRadius : 20,
    borderTopRightRadius : 20,
    borderBottomWidth: 2  ,
    justifyContent : "center",
    alignContent : "center",
  },
  Week:{
    flex : 0.09,
    fontSize : 20,
    fontWeight : 'bold',
    color: 'black', 
    backgroundColor : '#AFEEEE',
    borderBottomWidth: 2  ,
    height : 45,
    paddingLeft : 25,
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
    justifyContent : "center",
    alignItems : "center",
  },
  Include:{
    flexDirection : 'row',
    borderBottomWidth : 2,
    flex : 0.13,
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
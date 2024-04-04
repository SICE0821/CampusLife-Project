import React, {useState} from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import ModalBox from 'react-native-modalbox';
import Modal from 'react-native-modal';

const AttendancePage : React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달의 열기/닫기 상태를 useState로 관리
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getCurrentDate = () => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const day = days[now.getDay()];

    return `${year}년 ${month}월 ${date}일 ${day}요일`;
  };
  const checkopenModal = () => {
    setIsModalVisible(true); // 모달 열기
  };

  const openModal = () => {
    setIsModalOpen(true); // 모달을 열기 위해 상태를 true로 설정
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달을 닫기 위해 상태를 false로 설정
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>오늘의 출석</Text>
        <Text style={styles.date}>{getCurrentDate()}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.AttendanceList} onPress={openModal}>
          <Text style={styles.ListText}>DB 설계 및 관리</Text>
          <Text style={styles.ListInfo}>홍성욱 교수 | B0604                       미출결 : 45 출결 : 0 지각 : 0 결석 : 0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.AttendanceList} >
          <Text style={styles.ListText}>DB 설계 및 관리</Text>
          <Text style={styles.ListInfo}>홍성욱 교수 | B0604                       미출결 : 45 출결 : 0 지각 : 0 결석 : 0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.AttendanceList} >
          <Text style={styles.ListText}>DB 설계 및 관리</Text>
          <Text style={styles.ListInfo}>홍성욱 교수 | B0604                       미출결 : 45 출결 : 0 지각 : 0 결석 : 0</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.textContainer2}>
        <Text style={styles.title2}>출석 현황</Text>
      </View>
      <View style={styles.buttonContainer2}>
        <TouchableOpacity style={styles.AttendanceList} >
          <Text style={styles.ListText}>DB 설계 및 관리</Text>
          <Text style={styles.ListInfo}>홍성욱 교수 | B0604                       미출결 : 45 출결 : 0 지각 : 0 결석 : 0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.AttendanceList} >
          <Text style={styles.ListText}>DB 설계 및 관리</Text>
          <Text style={styles.ListInfo}>홍성욱 교수 | B0604                       미출결 : 45 출결 : 0 지각 : 0 결석 : 0</Text>
        </TouchableOpacity>
        </View>
        <ModalBox
          isOpen={isModalOpen}
          style={styles.modal}
          position="bottom"
          swipeToClose={false}
          onClosed={closeModal}
        >
          <View style = {{flex : 1, backgroundColor : 'red'}}>
            <View style = {{flex : 0.5, backgroundColor : 'blue'}}>
              
            </View>
          </View>
        </ModalBox> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: { // 컨테이너 전체를 담당
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  textContainer: { // 오늘의 출석, 날짜 텍스트 컨테이너
    alignItems: 'center',
    justifyContent: 'center',
    top: 40,
    marginRight : 205,
    marginBottom : 60,
  },
  textContainer2:{ // 출석 현황 텍스트 컨테이너
    alignItems: 'center',
    justifyContent: 'center',
    marginRight : 205,
    marginBottom : 20,
  },
  title: { // 오늘의 출석 텍스트 css
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginRight : 52,
    color : 'black',
  },
  title2: { // 출석 현황 텍스트 css
    fontSize: 20,
    fontWeight: 'bold',
    marginRight : 70,
    color : 'black',
  },
  date: { // 날짜 텍스트 css
    fontWeight: 'bold',
    fontSize: 15,
  },
  buttonContainer: { // 오늘의 출석 버튼 컨테이너
    marginBottom : 20,
    justifyContent: 'flex-start',
  },
  buttonContainer2: { // 출석 현황 버튼 컨테이너
    marginBottom : 20,
    justifyContent: 'flex-start',
    
  },
  AttendanceList: { // 과목마다의 버튼 
    borderBottomWidth: 2,
    marginBottom : 8,
    borderColor: 'black',
    width: 360,
  },
  ListText: { // 과목명 텍스트
    fontSize: 15,
    color: 'black',
    marginBottom: 3,
    fontWeight: 'bold',
    marginLeft: 5,
    
  },
  ListText2: { // 버튼 누른 후 과목명 텍스트
    fontSize: 25,
    color:'black',
    marginLeft : 25,
    marginTop : 30,
    fontWeight: 'bold',
    marginBottom : 5,
    backgroundColor : 'green' 
  },
  ListInfo: { // 과목마다의 출석 텍스트
    fontSize: 12,
    marginLeft: 5,
    marginBottom: 5,
    
  },
  ListInfo2: { // 버튼 누른 후 과목마다의 출석 텍스트
    fontSize: 15,
    marginLeft: 25,
    marginBottom: 15,
    backgroundColor : 'green'
  },
  modal: { // 모달 창 css
    borderTopLeftRadius : 20,
    borderTopRightRadius : 20,
    height: 550,
  },

  Week:{
    fontSize : 20,
    fontWeight : 'bold',
    color: 'black', 
    backgroundColor : '#AFEEEE',
    borderTopWidth : 2,
    borderBottomWidth: 2,
    height : 45, 
    width : 415,
    paddingTop : 9,
    paddingLeft : 23,
  },
  WeekContainer:{
    flex : 1,
    //backgroundColor : 'blue',
    //alignItems: 'center',
  },
  Attendance : {
    fontSize : 17,
    fontWeight : 'bold',
    color : 'black',
    //borderBottomWidth : 2,
    width : 415,
    height : 45,
    paddingTop : 9,
    paddingLeft : 26,
  },
  Box:{
    width: 25,
    height : 25,
    backgroundColor : 'black',
  },
  weekInfo: {
    flex : 0.2,
    //backgroundColor : "red",
    flexDirection : 'row',
    borderBottomWidth : 2,
  }
});

export default AttendancePage;
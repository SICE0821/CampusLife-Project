import React, {useState, useEffect} from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, ScrollView, Dimensions} from 'react-native';
import ModalBox from 'react-native-modalbox';
import Modal from 'react-native-modal';
import IconA from 'react-native-vector-icons/FontAwesome5';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { Camera,
  useCameraDevice, 
  useCameraPermission, 
  useCodeScanner } from 'react-native-vision-camera';

const AttendanceScreen = ({navigation, route}: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달의 열기/닫기 상태를 useState로 관리
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { hasPermission, requestPermission } = useCameraPermission()
  const [isCameraButton, setIsCameraButton] = useState(false);
  const [scannedCode, setScannedCode] = useState(null);
  const device = useCameraDevice('back')

  const getCurrentDate = () => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const day = days[now.getDay()];

    return `${year}년 ${month}월 ${date}일 ${day}요일`;
  };

  const openModal = () => {
    setIsModalOpen(true); // 모달을 열기 위해 상태를 true로 설정
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsCameraButton(false); // 모달을 닫을 때 카메라 버튼 상태도 false로 변경합니다.
  };

  const openCamera = () => {
    setIsCameraButton(true);
  };

  const getRealBoxColor = () => {
    if (scannedCode === 'YOUR_QR_CODE_VALUE') { // 스캔된 QR 코드 값에 따라 변경
      return 'green'; // 초록색
    } else {
      return 'gray'; // 기본 색상
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
    if (route.params && route.params.scannedCode) {
      setScannedCode(route.params.scannedCode);
    }
  }, [route.params]);


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
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View style={{ flexDirection: 'row' }}>
              <View>
                <Text style={styles.ListText2}>DB 설계 및 관리</Text>
              </View>
              <View style={{ marginLeft: 175 }}>
                <TouchableOpacity onPress={openCamera}>
                  <IconA name="camera" size={32} color="black" />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <View>
                <Text style={styles.ListInfo2}>미출결 : 45 출결 : 0 지각 : 0 결석 : 0</Text>
              </View>
            </View>
          </View>
              <View style={styles.WeekContainer}>
                  <View style={styles.Week}>
                    <Text style={{fontSize:20 , fontWeight : 'bold', color : 'black'}}>1주차</Text>
                  </View>
                  <View style={styles.View}>
                    <View style={styles.Include}>
                      <View style={styles.Attendance}>
                          <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'black', marginLeft : 25 }}>1차시         09 : 10 ~ 10 : 00</Text>
                      </View>
                      <View style={styles.Box}>  
                        <View style={[styles.realBox, { backgroundColor: getRealBoxColor() }]}>
                        </View>
                      </View>
                    </View>
                    <View style={styles.Include}>
                      <View style={styles.Attendance}>
                        <Text style = {{fontSize:17 , fontWeight : 'bold', color : 'black', marginLeft : 25}}>1차시         09 : 10 ~ 10 : 00</Text>
                      </View>
                      <View style={styles.Box}>  
                        <View style={[styles.realBox, { backgroundColor: getRealBoxColor() }]}>

                        </View>
                      </View>
                    </View>
                    <View style={styles.Include}>
                      <View style={styles.Attendance}>
                        <Text style = {{fontSize:17 , fontWeight : 'bold', color : 'black', marginLeft : 25}}>1차시         09 : 10 ~ 10 : 00</Text>
                      </View>
                      <View style={styles.Box}>  
                        <View style={[styles.realBox, { backgroundColor: getRealBoxColor() }]}>

                        </View>
                      </View>
                    </View>
                  </View>
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
  phonecontainer:{
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  scanner:{
    flex : 1,
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
    marginLeft : 6,
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
    fontWeight: 'bold',
    
  },
  ListInfo: { // 과목마다의 출석 텍스트
    fontSize: 12,
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
    height: 550,
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
    justifyContent : "center",
    alignContent : "center",
  },
  Week:{
    flex : 0.09,
    fontSize : 20,
    fontWeight : 'bold',
    color: 'black', 
    backgroundColor : '#AFEEEE',
    borderTopWidth : 2,
    borderBottomWidth: 2,
    paddingTop : 10,
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
    backgroundColor : 'red',
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
});

export default AttendanceScreen;
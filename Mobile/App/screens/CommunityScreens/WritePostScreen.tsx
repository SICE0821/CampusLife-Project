import React, { useState, useEffect, useRef } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Text, View, Button, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import IconB from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import ModalBox from 'react-native-modalbox';

const WritePostPage: React.FC = () => {
  const navigation = useNavigation();
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달의 열기/닫기 상태를 useState로 관리
  const [selectallposter, setselectapllposterOption] = useState(0); // 선택된 옵션의 인덱스를 useState로 관리
  const [selectdepartmentposter, setselectdepartmentposter] = useState(0); // 선택된 옵션의 인덱스를 useState로 관리
  const [postfontoption, setpostfontoption] = useState("게시판을 정해주세요");
  const [titletext, settitleText] = useState('');
  const [maintext, setmainText] = useState('');
  const [post_id, setpost_id] = useState(285);

  const [isModalVisible, setIsModalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      changeHeaderRightContent();
    }, [])
  );

  const changeHeaderRightContent = () => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => sendDataToServer()}>
          <View style={{ flexDirection: 'row', backgroundColor: '#B20000', justifyContent: 'center', alignItems: 'center', width: 65, height: 35, borderRadius: 20, marginRight: 10 }}>
            <Text style={{ color: 'white', fontSize: 17, fontWeight: "bold" }}>완료</Text>
          </View>
        </TouchableOpacity>
      )
    });
  };

  const checkopenModal = () => {
    setIsModalVisible(true); // 모달 열기
  };

  const checkcloseModal = () => {
    navigation.goBack();
  };

  const sendDataToServer = async () => {
    const post = {
      post_id: 601,
      user_id: 6,
      department_check: selectdepartmentposter,
      inform_check: 0,
      title: titletext,
      contents: maintext,
      data: "?",
      view: 0,
      like: 0,
    };

    try {
      const response = await fetch('http://192.168.35.207:3000/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      });
      const responseData = await response.json();
      //console.log(responseData);
      checkopenModal();
    } catch (error) {
      console.error('Error:'); // error.message를 사용하여 오류 메시지를 출력합니다.
    }
  };

  useEffect(() => {
    // selectallposter와 selectdepartmentposter를 비교하여 postfontoption을 설정
    if (selectallposter === 1) {
      setpostfontoption("전체 게시판");
    } else if (selectdepartmentposter === 1) {
      setpostfontoption("학과 게시판");
    } else {
      setpostfontoption("게시판을 정해주세요");
    }
  }, [selectallposter, selectdepartmentposter]);

  const openModal = () => {
    setIsModalOpen(true); // 모달을 열기 위해 상태를 true로 설정
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달을 닫기 위해 상태를 false로 설정
  };

  const handleAllPosterPress = () => {
    setselectapllposterOption(1);
    setselectdepartmentposter(0);
  };

  const handleDepartmentPosterPress = () => {
    setselectapllposterOption(0);
    setselectdepartmentposter(1);
  };

  const handletitleTextChange = (inputText: string) => {
    settitleText(inputText);
  };

  const handlemainTextChange = (inputText: string) => {
    setmainText(inputText);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.postoption}>
          <View style={styles.selectpost}>
            <View style={{ flex: 1 }}>
              <Text style={styles.selectfont}>{postfontoption}</Text>
            </View>
            <TouchableOpacity onPress={openModal} style={{ marginLeft: 180 }}>
              <Text style={{ color: 'black' }}><IconB name="down" size={30} /></Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.selectpostcontainer}>
          <View style={styles.selectpost}>
            <TextInput
              style={styles.selectfont}
              onChangeText={handletitleTextChange}
              value={titletext}
              placeholder="제목"
            />
          </View>
        </View>
        <View style={styles.writespace}>
          <TextInput
            style={{ fontSize: 20, }}
            onChangeText={handlemainTextChange}
            value={maintext}
            multiline={true}
            placeholder="이 곳에 글을 입력해주세요!"
          />
        </View>
      </ScrollView>
      <ModalBox
        isOpen={isModalOpen} // 모달의 열기/닫기 상태를 prop으로 전달
        style={styles.modal}
        position="bottom"
        swipeToClose={false}
        onClosed={closeModal} // 모달이 닫힐 때 호출되는 콜백 함수
      >
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.allposter} onPress={handleAllPosterPress}>
            <Text style={[styles.noallposterfont, selectallposter == 1 && styles.yesallposterfont]}> 전체 게시판 </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.allposter} onPress={handleDepartmentPosterPress}>
            <Text style={[styles.noallposterfont, selectdepartmentposter === 1 && styles.yesallposterfont]}> 학과 게시판 </Text>
          </TouchableOpacity>
          <View style={styles.writeButtom}>
            <View style={{ flex: 0.65, }}>
            </View>
            <TouchableOpacity onPress={closeModal} style={{ flex: 0.35, justifyContent: 'center', alignItems: "center", backgroundColor: '#9A9EFF' }}>
              <Text style={{ fontSize: 20, color: 'black' }}>선택 완료</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ModalBox>
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>등록 확인</Text>
          <Text style={styles.message}>글이 등록되었습니다.</Text>
          <TouchableOpacity style={styles.confirmButton} onPress={checkcloseModal}>
            <Text style={styles.confirmButtonText}>확인</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor : 'green'
  },
  postoption: {
    height: 70,
    //backgroundColor : 'red'
  },

  selectpostcontainer: {
    height: 70,
    //backgroundColor : 'blue'
  },
  selectpost: {
    flex: 1,
    margin: 10,
    marginRight: 15,
    marginLeft: 15,
    //backgroundColor : 'yellow',
    borderBottomWidth: 1,
    alignItems: 'center',
    flexDirection: 'row'
  },
  selectfont: {
    //marginTop : 10,
    fontSize: 20,
    color: 'black',
    //backgroundColor : 'yellow'
  },
  writespace: {
    margin: 15,
    flex: 0.82,
    //backgroundColor : 'blue'
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 400,
  },
  modalContent: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
  },

  allposter: {
    flex: 0.2,
    //backgroundColor : 'red',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    borderBottomWidth: 2,
  },

  noallposterfont: {
    color: '#CCCCCC',
    fontSize: 25,
    marginTop: 15,
  },

  yesallposterfont: {
    fontSize: 25,
    marginTop: 15,
    color: 'black'
  },

  departmentposter: {
    flex: 0.5,
    backgroundColor: 'green',
  },

  writeButtom: {
    flex: 0.6,
    //backgroundColor : 'green',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: '#009688',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },


})

export default WritePostPage;
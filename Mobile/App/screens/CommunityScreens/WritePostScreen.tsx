import React, { useState, useEffect, useRef } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Text, View, Button, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import IconB from 'react-native-vector-icons/AntDesign';
import IconC from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import ModalBox from 'react-native-modalbox';
import { UserData } from '../../types/type'
import config from '../../config';

const WritePostPage: React.FC = ({ navigation, route }: any) => {
  console.log("you are in WritePostPage")
  const { userdata } = route.params;
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달의 열기/닫기 상태를 useState로 관리
  const [selectallposter, setselectapllposterOption] = useState(0); // 선택된 옵션의 인덱스를 useState로 관리
  const [selectdepartmentposter, setselectdepartmentposter] = useState(0); // 선택된 옵션의 인덱스를 useState로 관리
  const [postfontoption, setpostfontoption] = useState("게시판을 정해주세요");
  const [titletext, settitleText] = useState('');
  const [maintext, setmainText] = useState('');
  const [userData, setUserData] = useState<UserData>(userdata);

  const [isModalVisible, setIsModalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      changeHeaderRightContent();
    }, [selectdepartmentposter, titletext, maintext])
  );


  const goback = () => {
    navigation.goBack();
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

  const changeHeaderRightContent = () => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => {
          write_post();
        }}>
          <View style={{ flexDirection: 'row', backgroundColor: '#B20000', justifyContent: 'center', alignItems: 'center', width: 65, height: 35, borderRadius: 20, marginRight: 10 }}>
            <Text style={{ color: 'white', fontSize: 17, fontWeight: "bold" }}>완료</Text>
          </View>
        </TouchableOpacity>
      )
    });
  };

  const ok_go = () => {
    Alert.alert(
      "게시물 작성",
      "게시물 작성을 완료했습니다!",
      [
        { text: "확인", onPress: () => goback() }
      ]
    );
  };

  const write_post = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/write_post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.user_pk,
          department_check: selectdepartmentposter,
          inform_check: 0,
          title: titletext,
          contents: maintext,
        })
      });
      await response.json();
      ok_go();

    } catch (error) {
      console.error('게시글 쓰기 실패!', error);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity onPress={openModal} style={styles.selectPostArea}>
          <Text style={styles.selectPostText}>{postfontoption}</Text>
          <IconB name="down" size={30} color={'black'} />
        </TouchableOpacity>
        <View style={styles.postTitleArea}>
            <TextInput
              style={styles.postTitleText}
              onChangeText={handletitleTextChange}
              value={titletext}
              placeholder="제목"
              placeholderTextColor={'gray'}
            />
        </View>
        <View style={styles.postContentArea}>
          <TextInput
            style={{ fontSize: 20, color: 'black' }}
            onChangeText={handlemainTextChange}
            value={maintext}
            multiline={true}
            placeholder="이 곳에 글을 입력해주세요!"
            placeholderTextColor={'gray'}
          />
        </View>
        <View style={styles.postImageArea}>
          <TouchableOpacity style={{width: 40, height: 40, backgroundColor: 'white'}}>
            <IconC name="image"/>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <ModalBox
        isOpen={isModalOpen} // 모달의 열기/닫기 상태를 prop으로 전달
        style={modalStyle.modal}
        position="bottom"
        swipeToClose={false}
        onClosed={closeModal} // 모달이 닫힐 때 호출되는 콜백 함수
      >
        <View style={modalStyle.modalContent}>
          <TouchableOpacity style={modalStyle.allposter} onPress={handleAllPosterPress}>
            <Text style={[modalStyle.noallposterfont, selectallposter == 1 && modalStyle.yesallposterfont]}> 전체 게시판 </Text>
          </TouchableOpacity>
          <TouchableOpacity style={modalStyle.allposter} onPress={handleDepartmentPosterPress}>
            <Text style={[modalStyle.noallposterfont, selectdepartmentposter === 1 && modalStyle.yesallposterfont]}> 학과 게시판 </Text>
          </TouchableOpacity>
          <View style={modalStyle.writeButtom}>
            <View style={{ flex: 0.65, }}>
            </View>
            <TouchableOpacity onPress={closeModal} style={{ flex: 0.35, justifyContent: 'center', alignItems: "center", backgroundColor: '#9A9EFF' }}>
              <Text style={{ fontSize: 20, color: 'black' }}>선택 완료</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ModalBox>
      <Modal isVisible={isModalVisible}>
        <View style={modalStyle.modalContainer}>
          <Text style={modalStyle.title}>등록 확인</Text>
          <Text style={modalStyle.message}>글이 등록되었습니다.</Text>
          <TouchableOpacity style={modalStyle.confirmButton} onPress={goback}>
            <Text style={modalStyle.confirmButtonText}>확인</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  selectPostArea: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 20,
    justifyContent: 'space-between',
    borderBottomWidth: 2,
  },
  selectPostText: {
    fontSize: 22,
    color: 'black',
  },
  postTitleArea: {
    marginHorizontal: 20,
    paddingVertical: 0,
    marginVertical: 20,
    borderBottomWidth: 2,
  },
  postTitleText: {
    fontSize: 22,
    color: 'black',
  },
  postContentArea: {
    marginHorizontal: 20,
  },
  postImageArea: {
    backgroundColor: 'red'
  }

})

const modalStyle = StyleSheet.create({
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
    justifyContent: 'center', // 수직 정렬
    alignItems: 'center', // 수평 정렬
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    margin: 20,
  },

  noallposterfont: {
    color: '#CCCCCC',
    borderBottomWidth: 2,
    borderBottomColor: '#CCCCCC',
    width: '100%', // 가로 길이 조정
    textAlign: 'center', // 텍스트 가운데 정렬
    paddingBottom: 10,
    fontSize: 25,
    marginTop: 15,
  },

  yesallposterfont: {
    fontSize: 25,
    marginTop: 15,
    borderBottomColor: 'black',
    color: 'black',
    width: '100%', // 가로 길이 조정
    textAlign: 'center', // 텍스트 가운데 정렬
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
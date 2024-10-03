import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions, Image, Modal, TouchableOpacity, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Swiper from 'react-native-swiper';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/AntDesign';
import { UserData, EventData, VoteEvnetData } from '../../types/type';
import { useFocusEffect } from '@react-navigation/native';
import { RadioButton } from 'react-native-paper';
import config from '../../config';

// 화면 크기 정보 가져오기
const width = Dimensions.get('window').width;

type userEvent = {
  user_id: number,
  event_id: number
};

const DeadlineEventScreen = ({ route }: any) => {
  const { userdata, eventdata } = route.params;
  
  // 상태 변수 정의
  const [maintext, setMainText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<null | string>(null);
  const [selectedFiles, setSelectedFiles] = useState<DocumentPickerResponse[]>([]);
  const [userData, setUserData] = useState<UserData>(userdata);
  const [eventData, setEventData] = useState<EventData>(eventdata);
  const [usereventData, setUserEventData] = useState<userEvent[]>([]);
  const [checked, setChecked] = useState('');
  const [voteOptions, setVoteOptions] = useState<string[]>(); // 투표 옵션
  const [onevoteInfo, setOneVoteInfo] = useState<VoteEvnetData[]>([]);

  // 화면 포커스 시 데이터 불러오기
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          settingDate();
          await GetoneEventVote();
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }, [])
  );

  // 특정 이벤트의 투표 정보 불러오기
  const GetoneEventVote = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/GetoneEventVote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: eventData.event_id }),
      });
      const data: VoteEvnetData[] = await response.json();
      const voteInfo: VoteEvnetData[] = data.filter(info => info.vote_name !== 'null');
      setVoteOptions(voteInfo.map(info => info.vote_name));
    } catch (error) {
      console.error(error);
    }
  };

  // 사용자 투표 정보 전송
  const SendUserEventVote = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/SendUserEventVote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: eventData.event_id, vote_name: checked }),
      });
      await response.json();
    } catch (error) {
      console.error(error);
    }
  };

  // 화면 로드 시 데이터 설정
  const settingDate = () => {
    setUserData(userData);
    setEventData(eventdata);
  };

  // 텍스트 입력 핸들러
  const handleMainTextChange = (inputText: string) => {
    setMainText(inputText);
  };

  // 이미지 클릭 시 확대 이미지 보기
  const handleImagePress = (image: string) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  // 파일 선택
  const handleFilePick = async () => {
    try {
      const res = await DocumentPicker.pick({ type: [DocumentPicker.types.allFiles] });
      if (selectedFiles.length < 5) {
        setSelectedFiles([...selectedFiles, res[0]]);
      } else {
        Alert.alert('파일은 최대 5개까지 첨부할 수 있습니다.');
      }
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        throw err;
      }
    }
  };

  // 파일 업로드
  const uploadAllFiles = async () => {
    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('images', {
        uri: file.uri,
        type: file.type,
        name: `${Date.now()}_${userData.user_pk}_${eventData.event_id}.png`,
      });
    });
    await uploadImages(formData);
  };

  // 이미지 서버 업로드 처리
  const uploadImages = async (formData: FormData) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(`${config.serverUrl}/send_user_event_photo`, {
        method: 'POST',
        body: formData,
      });
      clearTimeout(timeoutId);
      await response.text();
    } catch (error) {
      console.error('이미지 업로드 중 오류:', error);
    }
  };

  // 사용자 이벤트 정보 전송
  const send_user_event_info = async () => {
    try {
      await fetch(`${config.serverUrl}/send_user_event_info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userData.user_pk, event_id: eventData.event_id, content: maintext }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  // 이벤트 전송 확인 및 알림 처리
  const send_event_alert = async () => {
    let hasRegistered = false;
    usereventData.forEach(data => {
      if (data.user_id === userData.user_pk && data.event_id === eventData.event_id) {
        hasRegistered = true;
      }
    });

    if (hasRegistered) {
      Alert.alert('이미 이벤트를 등록하셨습니다.');
    } else {
      Alert.alert(
        '이벤트 작성완료',
        `이벤트를 성공적으로 작성하셨습니다.\n종료 일자: ${eventData.close_date}`,
        [
          {
            text: '확인',
            onPress: async () => {
              await send_user_event_info();
              await SendUserEventVote();
              if (selectedFiles.length > 0) {
                await uploadAllFiles();
              }
              setUserEventData([...usereventData, { user_id: userData.user_pk, event_id: eventData.event_id }]);
            },
          },
        ]
      );
    }
  };

  // 파일 제거
  const handleFileRemove = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.eventLabelArea}>
          <Text style={styles.eventLabel}>{eventData?.name}</Text>
        </View>
        
        {/* 이벤트 이미지 슬라이더 */}
        <View style={styles.eventImageArea}>
          <Swiper showsPagination={true} loop={true}>
            {eventData.event_photo.map((image, index) => (
              <TouchableOpacity key={index} style={styles.eventImageBox} onPress={() => handleImagePress(image.event_photo)}>
                <Image style={styles.eventImage} source={{ uri: `${config.photoUrl}/${image.event_photo}.png` }} />
              </TouchableOpacity>
            ))}
          </Swiper>
        </View>

        <View style={styles.eventInfoArea}>
          <Text style={styles.explaintext}>{eventData?.simple_info}</Text>
          <Text style={styles.eventInfo}>{eventData?.info}</Text>

          {/* 투표 영역 */}
          <View style={styles.eventVoteArea}>
            {voteOptions?.map((option, index) => (
              <TouchableOpacity key={index} style={styles.eventVoteBox} onPress={() => setChecked(option)}>
                <Text style={styles.eventVoteText}>{index + 1}. {option}</Text>
                <RadioButton value={option} status={checked === option ? 'checked' : 'unchecked'} />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.dateInfo}>
            <Text style={styles.endInfo}>종료 날짜: {eventData?.close_date}</Text>
          </View>
        </View>

        

        {/* 파일 첨부 및 텍스트 입력 */}
        {voteOptions && voteOptions.length === 0 && (
          <>
            <View style={styles.fileInputArea}>
              <TouchableOpacity style={styles.fileButton} onPress={handleFilePick}>
                <Text style={styles.fileButtonText}>파일 첨부</Text>
              </TouchableOpacity>
              {selectedFiles.map((file, index) => (
                <View key={index} style={styles.fileInfo}>
                  <Text style={styles.fileName}>{file.name}</Text>
                  <TouchableOpacity onPress={() => handleFileRemove(index)} style={styles.cancelButton}>
                    <Icon name="closecircleo" size={18} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <View style={styles.writeSpace}>
              <TextInput
                style={styles.textInput}
                onChangeText={handleMainTextChange}
                value={maintext}
                multiline={true}
                placeholder="이 곳에 글을 입력해주세요!"
                placeholderTextColor="gray"
              />
            </View>
          </>
        )}

        <View style={styles.sendButtonContainer}>
          <TouchableOpacity onPress={send_event_alert}>
            <View style={styles.sendArea}>
              <Text style={styles.sendText}>전송</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 이미지 확대 모달 */}
      {selectedImage !== null && (
        <Modal visible={modalVisible} transparent={true} animationType="slide" onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Image style={{ width: width, height: width }} source={{ uri: `${config.photoUrl}/${selectedImage}.png` }} />
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  eventLabelArea: {
    justifyContent: 'center',
    backgroundColor: 'white',
    width: width,
    minHeight: 70,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  eventLabel: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  eventInfoArea: {
    padding: 10,
    backgroundColor: 'white',
    width: width,
    minHeight: 150,
  },
  explaintext: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  eventInfo: {
    fontSize: 17,
    color: 'black',
  },
  eventVoteArea: {
    alignItems: 'center',
    width: '100%',
    marginTop: 15,
  },
  eventVoteBox: {
    backgroundColor: '#dddddd',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginVertical: 10,
    borderRadius: 15,
    width: '80%',
    height: 50,
  },
  eventVoteText: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  dateInfo: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  endInfo: {
    fontSize: 16,
    color: 'grey',
  },
  eventImageArea: {
    width: width,
    height: width,
    alignSelf: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  eventImageBox: {
    width: width,
    height: width,
    alignItems: 'center',
  },
  eventImage: {
    flex: 1,
    width: width,
    resizeMode: 'contain',
  },
  fileInputArea: {
    alignItems: 'center',
    marginVertical: 15,
  },
  fileButton: {
    padding: 10,
    backgroundColor: '#FFC700',
    borderRadius: 10,
    elevation: 2,
  },
  fileButtonText: {
    fontSize: 16,
    color: 'black',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  fileName: {
    fontSize: 16,
    color: 'black',
  },
  cancelButton: {
    marginLeft: 5,
  },
  writeSpace: {
    padding: 10,
    backgroundColor: 'white',
    minHeight: 250,
    margin: 20,
    marginBottom: 5,
    borderWidth: 1,
    borderRadius: 5,
  },
  textInput: {
    fontSize: 20,
    color: 'black',
  },
  sendButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendArea: {
    marginTop: 30,
    width: width - 40,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFC700',
    borderRadius: 10,
  },
  sendText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default DeadlineEventScreen;

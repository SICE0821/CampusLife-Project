import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions, Image, Modal, TouchableOpacity, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Swiper from 'react-native-swiper';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/AntDesign';
import { UserData, EventData, VoteEvnetData } from '../../types/type';
const width = Dimensions.get("window").width;
import { useFocusEffect } from '@react-navigation/native';
import config from '../../config';
import { RadioButton } from 'react-native-paper';

type userEvent = {
  user_id: number,
  event_id: number
};

const eventImages = [
  require('../../assets/001.png'),
  require('../../assets/002.png'),
  require('../../assets/부천대.png'),
  // Add more images here up to a maximum of 10
];

const voteInfo = [ // null이면 안보임
  {vote : '문주영'},
  {vote : '김주연'},
  {vote : 'null'},
  {vote : 'null'},
  {vote : 'null'},
].filter(info => info.vote !== 'null');

const DeadlineEventScreen = ({ route }: any) => {
  const { userdata, eventdata } = route.params;
  //console.log(eventdata);
  const [maintext, setMainText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<null | string>(null);
  const [selectedFiles, setSelectedFiles] = useState<DocumentPickerResponse[]>([]);
  const [userData, setUserData] = useState<UserData>(userdata);
  const [eventData, setEventData] = useState<EventData>(eventdata);
  const [usereventData, setUserEventData] = useState<userEvent[]>([]);
  const [checked, setChecked] = useState('');
  const [voteOptions, setVoteOptions] = useState<string[]>(); // Initial voting options
  const [onevoteInfo, setOneVoteInfo] = useState<VoteEvnetData[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      settingDate();
      GetoneEventVote();
    }, []
    )
  );

  const GetoneEventVote = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/GetoneEventVote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id : eventData.event_id
        }),
      })
      const data : VoteEvnetData[] = await response.json();
      const voteInfo : VoteEvnetData[]= data.filter(info => info.vote_name !== 'null');
      setVoteOptions(voteInfo.map(info => info.vote_name));
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  const SendUserEventVote = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/SendUserEventVote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id : eventData.event_id,
          vote_name : checked,
        }),
      })
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  useEffect(() => {
    fetchEventData();
  }, []);

  const settingDate = () => {
    setUserData(userData);
    setEventData(eventdata);
  };

  const handleMainTextChange = (inputText: string) => {
    setMainText(inputText);
  };

  const handleImagePress = (image: string) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const handleFilePick = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      if (selectedFiles.length < 5) {
        setSelectedFiles([...selectedFiles, res[0]]);
      } else {
        Alert.alert('You can upload a maximum of 5 files.');
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        throw err;
      }
    }
  };

  const uploadAllFiles = async () => {
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('images', {
        uri: file.uri,
        type: file.type,
        name: `${Date.now()}_${userData.user_pk}_${eventData.event_id}.png`
      });
    });
    console.log(formData);
    await uploadImages(formData);
  };

  const uploadImages = async (formData: FormData) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(`${config.serverUrl}/send_user_event_photo`, {
        method: 'POST',
        body: formData,
      });
      clearTimeout(timeoutId);
      const imageName = await response.text();
      console.log(imageName);
      if (response.ok) {
        console.log('Images uploaded successfully');
      } else {
        console.error('Error uploading images');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  const send_user_event_info = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/send_user_event_info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.user_pk,
          event_id: eventData.event_id,
          content: maintext,
        }),
      });

      if (!response.ok) {
        throw new Error('서버 응답 오류');
      }

    } catch (error) {
      console.error(error);
    }
  };

  const fetchEventData = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/select_user_event_info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_pk: userData.student_pk
        })
      });
      const data = await response.json();
      setUserEventData(data);
    } catch (error) {
      console.error('과목 가져오기 실패:', error);
    }
  };

  const send_event_alert = async () => {
    // 사용자가 이미 해당 이벤트를 등록한 경우
    let hasRegistered = false;
    usereventData.forEach(data => {
      if (data.user_id === userData.user_pk && data.event_id === eventData.event_id) {
        hasRegistered = true;
      }
    });

    if (hasRegistered) {
      // 이미 등록한 사용자인 경우
      Alert.alert("이미 이벤트를 등록하셨습니다.");
    } else {
      // 등록되지 않은 사용자인 경우
      Alert.alert(
        "이벤트 작성완료",
        `이벤트를 성공적으로 작성하셨습니다. 
당첨되시면 알람이 자동으로 가게됩니다.
종료 일자 : ${eventData.close_date}`,
        [
          {
            text: "확인", onPress: () => {
              send_user_event_info();
              SendUserEventVote();
              if (selectedFiles.length > 0) {
                uploadAllFiles();
              }
              // 여기서 이벤트 등록 상태를 업데이트합니다.
              setUserEventData([...usereventData, { user_id: userData.user_pk, event_id: eventData.event_id }]);
            }
          }
        ]
      );
    }
  };

  const sendEvent = () => {

    // 사용자가 이벤트를 등록하지 않은 경우, 초기화 코드 실행
    setSelectedFiles([]);
    setMainText("이곳에 글을 입력해 주세요");
  };

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
        <View style={styles.eventInfoArea}>
          <Text style={styles.explaintext}>{eventData?.simple_info}</Text>
          <Text style={styles.eventInfo}>{eventData?.info}</Text>

          <View style={styles.eventVoteArea}>
            {voteOptions?.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.eventVoteBox}
                onPress={() => {
                  setChecked(option)
                  console.log(option)
                }}
              >
                <Text style={styles.eventVoteText}>{index + 1}. {option}</Text>
                <RadioButton
                  value={option}
                  status={checked === option ? 'checked' : 'unchecked'}
                />
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
            <Text style={styles.endInfo}>종료날짜 : {eventData?.close_date}</Text>
          </View>
        </View>

        <View style={styles.eventImageArea}>
          <Swiper showsPagination={true} loop={true} removeClippedSubviews={false}>
            {eventData.event_photo.map((image, index) => (
              <TouchableOpacity key={index} style={styles.eventImageBox} onPress={() => handleImagePress(image.event_photo)}>
                <Image style={styles.eventImage} source={{ uri: `${config.photoUrl}/${image.event_photo}.png` }} />
              </TouchableOpacity>
            ))}
          </Swiper>
        </View>
        <View style={styles.fileInputArea}>
          <TouchableOpacity style={styles.fileButton} onPress={() => {
            handleFilePick();
            console.log(selectedFiles);
          }}>
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
            placeholderTextColor={'gray'}
          />
        </View>

        
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity onPress={async () => {
            sendEvent();
            send_event_alert();
          }}>
            <View style={styles.sendArea}>
              <Text style={styles.sendText}>전송</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ height: 20 }}></View>
      </ScrollView>

      {selectedImage !== null && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  eventLabelArea: {
    //alignItems: 'center',
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
    //textAlign : 'center'
  },
  eventInfoArea: {
    //alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    width: width,
    minHeight: 150,
  },
  eventInfo: {
    fontSize: 17,
    color: 'black',
  },
  eventVoteArea: {
    //backgroundColor: 'red',
    alignItems: 'center',
    width: '100%',
    marginTop: 15
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
    marginLeft: 10

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
    elevation: 2
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
    top: 3,
    //backgroundColor: 'red',
  },
  writeSpace: {
    padding: 10,
    backgroundColor: 'white',
    minHeight: 250,
    margin: 20,
    borderWidth: 1,
    borderRadius: 5,
  },
  textInput: {
    fontSize: 20,
    color: 'black',
  },
  sendArea: {
    width: width - 40,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFC700',
    borderRadius: 10
  },
  sendText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold'
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
    //padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: 500,
    resizeMode: 'contain',
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
  explaintext: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  }
});

export default DeadlineEventScreen;

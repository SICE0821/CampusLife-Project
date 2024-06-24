import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text, Image, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import Swiper from 'react-native-swiper';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { UserData, AdminEventList, UserSendEventWithPhoto, UserSendEventPhotoData } from '../../types/type'
import config from '../../config';
import IconA from 'react-native-vector-icons/MaterialIcons'

const width = Dimensions.get("window").width;

const eventName = [
  { id: 1, name: '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' },
  { id: 2, name: '이벤트 2' },
  { id: 3, name: '이벤트 3' },
];

type EventVoteInfo = {
  id: number;
  vote1: string;
  vote2: string;
  vote3: string;
  vote4: string;
  vote5: string;
  [key: string]: any;  // Index signature
}

const eventVoteInfo: EventVoteInfo[] = [
  { id: 1, vote1: '투표 내용 1', vote2: '투표 내용 2', vote3: '투표 내용 3', vote4: '투표 내용 4', vote5: '투표 내용 5' }
];

const takePartInfo = [
  { userName: '홍길동', userId: 'asdasdasdadada', eventId: 1, sendText: '이벤트 참여 내용 1 이벤트 참여 내용 1 이벤트 참여 내용 1 이벤트 참여 내용 1 이벤트 참여 내용 1 이벤트 참여 내용 1 이벤트 참여 내용 1 이벤트 참여 내용 1 이벤트 참여 내용 1', sendFile: [require('../../assets/event1.jpg'), require('../../assets/event2.png'), require('../../assets/event1.jpg'), require('../../assets/event2.png'), require('../../assets/event1.jpg'), require('../../assets/AttendanceCheckEvent.jpg')], vote: 1 },
  { userName: '남도현', userId: 'basdasdasdadsbbb', eventId: 2, sendText: '이벤트 참여 내용 2', sendFile: [require('../../assets/event2.png')], vote: 2 },
  { userName: '정유환', userId: 'aaaa', eventId: 1, sendText: '이벤트 참여 내용 3', sendFile: [require('../../assets/event1.jpg')], vote: 3 },
];

const SendUserEventScreen = ({ route }: any) => {
  const { userdata } = route.params;
  //console.log(userdata);
  const [userData, setUserData] = useState<UserData>(userdata); //유저 데이터
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); //유저 이벤트 사진을 선택했을때 인덱스 저장공간
  const [selectedEventImages, setSelectedEventImages] = useState<UserSendEventPhotoData[]>([]); //유저 이벤트 사진을 선택했을때 저장공간
  const [selectedEventId, setSelectedEventId] = useState();
  const [userSendEventData, setUserSendEventData] = useState<UserSendEventWithPhoto[]>([]);
  const [eventList, setEventList] = useState<AdminEventList[]>([]); //이벤트 리스트


  useFocusEffect(
    React.useCallback(() => {
      setUserData(userdata);
      GetEventList();
      GetUserSendEvent();
    }, [])
  );


  const addGoodEventAram = async (user_id : number, event_id :number) => {
    try {
      const response = await fetch(`${config.serverUrl}/addGoodEventAram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user_id,
          target_id: event_id,
        })
      });
    } catch (error) {
      console.error('알람 전송 실패', error);
    }
  }

  const setUserSendtype = async (user_send_event : number) => {
    try {
      const response = await fetch(`${config.serverUrl}/setUserSendtype`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_send_event: user_send_event,
        })
      });
    } catch (error) {
      console.error('알람 전송 실패', error);
    }
  }


  const handlePrizeUser = (user_id: number, event_point: number, evnet_id : number, user_send_event : number) => {
    Alert.alert(
      "이벤트 당첨!",
      "해당 유저에게 포인트를 보여하시겠습니까??",
      [
        { text: "취소", style: "cancel" },
        {
          text: "확인", onPress: async () => {
            try {
                good_404();
                addGoodEventAram(user_id, evnet_id);
                AdminSendPoint(user_id, event_point);
                setUserSendtype(user_send_event);
                GetEventList();
              console.log("모든 요청이 성공적으로 완료되었습니다.");
            } catch (error) {
              console.error("요청 중 오류가 발생했습니다:", error);
            }

          }
        }
      ]
    );
  };

  const good_404 = () => {
    Alert.alert(
      "포인트 전송 성공!",
      `해당 유저에게 포인트가 전송되었습니다.
해당 유저에게 자동으로 알람이 가게 됩니다!!`,
      [
        {
          text: "확인", onPress: () => {
          }
        }
      ]
    );
  };

  //유저의 이벤트 목록 가져오기
  const GetUserSendEvent = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/GetUserSendEvent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campus_id: userData.campus_pk
        }),
      })
      const data = await response.json();
      const UserSendEventWithPhoto = await Promise.all(
        data.map(async (eventData: any) => {
          const photoData = await GetUserEventPhoto(eventData.event_id, eventData.user_id);
          return { ...eventData, photodata: photoData };
        })
      );
      //console.log(JSON.stringify(UserSendEventWithPhoto, null, 2));
      //console.log(UserSendEventWithPhoto);
      setUserSendEventData(UserSendEventWithPhoto);
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  //유저의 이벤트 목록 중 사진 가져오기
  const GetUserEventPhoto = async (event_id: any, user_id: any) => {
    try {
      const response = await fetch(`${config.serverUrl}/GetUserEventPhoto`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: event_id,
          user_id: user_id,
        }),
      })
      const data = await response.json();
      //console.log(data);
      return data
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  //당첨!!
  const AdminSendPoint = async (user_id: any, event_point: any) => {
    try {
      const response = await fetch(`${config.serverUrl}/AdminSendPoint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user_id,
          event_point: event_point,
        }),
      })
      const data = await response.json();
      //console.log(data);
      return data
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  //설정한 이벤트 보여주기
  const GetEventList = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/GetEventList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campus_id: userData.campus_pk
        }),
      })
      const data = await response.json();
      setEventList(data);
      setSelectedEventId(data[0].event_id);
      //console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
    }
  }
  const handleImagePress = (index: any, images: any) => {
    setSelectedImageIndex(index);
    setSelectedEventImages(images);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedImageIndex(0);
    setSelectedEventImages([]);
  };

  const truncateEventName = (name: string) => {
    return name.length > 20 ? name.substring(0, 20) + '...' : name;
  };

  const filteredEvents = userSendEventData.filter(event => event.event_id === selectedEventId);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.pickerArea}>
        <Text style={styles.pickerText}>선택한 이벤트 :</Text>
        <View style={styles.pickerBox}>
          <Picker
            selectedValue={selectedEventId}
            onValueChange={(itemValue) => setSelectedEventId(itemValue)}
            style={styles.picker}
            dropdownIconColor={'black'}
            dropdownIconRippleColor={'gray'}
          >
            {eventList.map(event => (
              <Picker.Item key={event.event_id} label={truncateEventName(event.name)} value={event.event_id} style={{ color: 'black' }} />
            ))}
          </Picker>
        </View>
      </View>
      {filteredEvents.length > 0 ? (
        filteredEvents.map((event, index) => (
          event.good_event === 1 ? (
            <TouchableOpacity
            key={index}
            style={styles.good_event_Box}
            onPress={() => {
              {
                console.log(event.user_name)
                console.log(event.event_point)
              }
            }}
            >
            <View style={styles.topInfoArea}>
              <Text style={styles.eventName}>{eventList.find(item => item.event_id === event.event_id)?.name}</Text>
              <View style={styles.userInfoArea}>
                <Text style={styles.userInfoText}>이름: {event.user_name}</Text>
                <Text style={styles.userInfoText}>아이디: {event.user_login_id}</Text>
              </View>
            </View>
            <Text style={styles.sendText}>{event.content}</Text>
            <View style = {styles.good_event_box}>
            <Text style = {{fontSize : 23, color : '#FF7F27', fontWeight: 'bold'}}>해당 유저가 이벤트에 당첨되었습니다!!</Text>
              <IconA name={"celebration"} size={60} style = {{color : '#FF7F27'}}/>
            </View>  
          </TouchableOpacity>
          ) : (
          <TouchableOpacity
            key={index}
            style={styles.eventBox}
            onLongPress={() => {
              handlePrizeUser(event.user_id, event.event_point, event.event_id, event.user_send_event);
            }}>
            <View style={styles.topInfoArea}>
              <Text style={styles.eventName}>{eventList.find(item => item.event_id === event.event_id)?.name}</Text>
              <View style={styles.userInfoArea}>
                <Text style={styles.userInfoText}>이름: {event.user_name}</Text>
                <Text style={styles.userInfoText}>아이디: {event.user_login_id}</Text>
              </View>
            </View>

            <Text style={styles.sendText}>{event.content}</Text>
            <ScrollView horizontal={true} style={styles.imageContainer}>
              {event.photodata && Array.isArray(event.photodata) && event.photodata.map((file, idx) => (
                <TouchableOpacity key={idx} onPress={() => {
                  //console.log(event.photodata);
                  handleImagePress(idx, event.photodata)
                }}>
                  <Image source={{ uri: `${config.photoUrl}/${file.event_photo}.png` }} style={styles.image} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </TouchableOpacity>
          )
        ))
      ) : (
        <Text style={styles.noEventText}>해당 이벤트 참여자가 없습니다.</Text>
      )}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={handleCloseModal}>
            <Text style={styles.modalCloseText}>닫기</Text>
          </TouchableOpacity>
          <View style={styles.modalContent}>
            <Swiper index={selectedImageIndex} loop={false}>
              {selectedEventImages.map((image, idx) => (
                <View key={idx} style={styles.slide}>
                  <Image source={{ uri: `${config.photoUrl}/${image.event_photo}.png` }} style={styles.modalImage} />
                </View>
              ))}
            </Swiper>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#eeeeee',
    padding: 10,
  },
  pickerArea: {
    backgroundColor: 'white',
    width: width * 0.95,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    padding: 10,
    elevation: 5,
    marginVertical: 10
  },
  pickerText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    width: '40%',
    textAlign: 'center'
  },
  pickerBox: {
    borderWidth: 1,
    borderRadius: 10,
  },
  picker: {
    minWidth: '60%',
    color: 'black',
  },
  eventBox: {
    backgroundColor: 'white',
    width: width * 0.95,
    marginBottom: 10,
    padding: 10,
    borderRadius: 15,
    elevation: 5,
  },

  good_event_Box: {
    backgroundColor: '#FFFFE0',
    width: width * 0.95,
    marginBottom: 10,
    padding: 10,
    borderRadius: 15,
    elevation: 5,
  },
  topInfoArea: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  eventName: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    maxWidth: '40%',
  },
  userInfoArea: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    maxWidth: '50%'
  },
  userInfoText: {
    maxWidth: '60%',
    color: 'black',
    fontSize: 16,
    marginLeft: 10,
  },
  sendText: {
    color: 'black',
    fontSize: 16,
    marginVertical: 10,
  },
  imageContainer: {
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    margin: 5,
  },
  noEventText: {
    color: 'black',
    fontSize: 16,
    marginTop: 50,
    textAlign: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 30,
    right: 30,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  modalCloseText: {
    color: 'black',
    fontSize: 16,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voteText: {
    color: 'black',
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
  good_event_box : {
    justifyContent : 'center',
    alignItems : 'center',
    flexDirection : 'row'
  }
});

export default SendUserEventScreen;

import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text, Image, ScrollView, TouchableOpacity, Modal } from 'react-native';
import Swiper from 'react-native-swiper';
import { Picker } from '@react-native-picker/picker';

const width = Dimensions.get("window").width;

const eventName = [
  { id: 1, name: '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' },
  { id: 2, name: '이벤트 2' },
  { id: 3, name: '이벤트 3' },
];

const takePartInfo = [
  { userName: '홍길동', userId: 'asdasdasdadada', eventId: 1, sendText: '이벤트 참여 내용 1 이벤트 참여 내용 1 이벤트 참여 내용 1 이벤트 참여 내용 1 이벤트 참여 내용 1 이벤트 참여 내용 1 이벤트 참여 내용 1 이벤트 참여 내용 1 이벤트 참여 내용 1', sendFile: [require('../../assets/event1.jpg'), require('../../assets/event2.png'), require('../../assets/event1.jpg'), require('../../assets/event2.png'), require('../../assets/event1.jpg'), require('../../assets/AttendanceCheckEvent.jpg')] },
  { userName: '남도현', userId: 'basdasdasdadsbbb', eventId: 2, sendText: '이벤트 참여 내용 2', sendFile: [require('../../assets/event2.png')] },
  { userName: '정유환', userId: 'aaaa', eventId: 1, sendText: '이벤트 참여 내용 3', sendFile: [require('../../assets/event1.jpg')] },
];

const SendUserEventScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedEventImages, setSelectedEventImages] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(eventName[0].id);

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

  const filteredEvents = takePartInfo.filter(event => event.eventId === selectedEventId);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.pickerArea}>
        <Text style={styles.pickerText}>선택한 이벤트 : </Text>
        <View style={styles.pickerBox}>
          <Picker
            selectedValue={selectedEventId}
            onValueChange={(itemValue) => setSelectedEventId(itemValue)}
            style={styles.picker}
            dropdownIconColor={'black'}
            dropdownIconRippleColor={'gray'}
          >
            {eventName.map(event => (
              <Picker.Item key={event.id} label={event.name} value={event.id} style={{ color: 'black' }} />
            ))}
          </Picker>
        </View>
      </View>
      {filteredEvents.length > 0 ? (
        filteredEvents.map((event, index) => (
          <View key={index} style={styles.eventBox}>
            <View style={styles.topInfoArea}>
              <Text style={styles.eventName}>{eventName.find(item => item.id === event.eventId)?.name}</Text>
              <View style={styles.userInfoArea}>
                <Text style={styles.userInfoText}>이름: {event.userName}</Text>
                <Text style={styles.userInfoText}>아이디: {event.userId}</Text>
              </View>
            </View>

            <Text style={styles.sendText}>{event.sendText}</Text>
            <ScrollView horizontal={true} style={styles.imageContainer}>
              {event.sendFile.map((file, idx) => (
                <TouchableOpacity key={idx} onPress={() => handleImagePress(idx, event.sendFile)}>
                  <Image source={file} style={styles.image} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
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
                  <Image source={image} style={styles.modalImage} />
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
    backgroundColor: 'white',
    padding: 10,
  },
  pickerArea: {
    width: width * 0.9,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10
  },
  pickerText: {
    color: 'black',
    fontSize: 18,
    width: '30%'
  },
  pickerBox: {
    borderWidth: 1,
    borderRadius: 10,
  },
  picker: {
    minWidth: '70%',
    color: 'black',
  },
  eventBox: {
    backgroundColor: '#eeeeee',
    width: width * 0.95,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
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
    maxWidth: '50%',
  },
  userInfoArea: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    maxWidth: '50%'
  },
  userInfoText: {
    maxWidth: '50%',
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
});

export default SendUserEventScreen;

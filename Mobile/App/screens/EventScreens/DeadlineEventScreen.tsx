import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions, Image, Modal, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Swiper from 'react-native-swiper';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/AntDesign';

const width = Dimensions.get("window").width;

const eventLabel = '이벤트 제목';
const eventInfo = '이벤트 정보 이벤트 정보 이벤트 정보 이벤트 정보 이벤트 정보';

const eventImages = [
  require('../../assets/event1.jpg'),
  require('../../assets/event2.png'),
  require('../../assets/friend3.png'),
  // Add more images here up to a maximum of 10
];

const DeadlineEventScreen = () => {
  const [maintext, setMainText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<null | number>(null);
  const [selectedFiles, setSelectedFiles] = useState<DocumentPickerResponse[]>([]);

  const handleMainTextChange = (inputText: string) => {
    setMainText(inputText);
  };

  const handleImagePress = (image: number) => {
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
        alert('You can upload a maximum of 5 files.');
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        throw err;
      }
    }
  };

  const handleFileRemove = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
  };

  function sendEvent() {
    
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.eventLabelArea}>
          <Text style={styles.eventLabel}>{eventLabel}</Text>
        </View>
        <View style={styles.eventInfoArea}>
          <Text style={styles.eventInfo}>{eventInfo}</Text>
        </View>
        <View style={styles.eventImageArea}>
          <Swiper showsPagination={true} loop={true} removeClippedSubviews={false}>
            {eventImages.map((image, index) => (
              <TouchableOpacity key={index} style={styles.eventImageBox} onPress={() => handleImagePress(image)}>
                <Image source={image} style={styles.eventImage} />
              </TouchableOpacity>
            ))}
          </Swiper>
        </View>
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
            placeholderTextColor={'gray'}
          />
        </View>
        <TouchableOpacity onPress={sendEvent}>
          <View style={styles.sendArea}>
            <Text style={styles.sendText}>전송</Text>
          </View>
        </TouchableOpacity>
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
              <Image source={selectedImage} style={styles.modalImage} />
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFECF',
    width: width,
    minHeight: 70,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  eventLabel: {
    color: 'black',
    fontSize: 32,
    fontWeight: 'bold',
  },
  eventInfoArea: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFDECF',
    width: width,
    minHeight: 150,
  },
  eventInfo: {
    fontSize: 16,
    color: 'black',
  },
  eventImageArea: {
    width: width,
    height: 400,
    alignSelf: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  eventImageBox: {
    flex: 1,
    alignItems: 'center',
  },
  eventImage: {
    flex: 1,
    maxWidth: width * 0.9,
    resizeMode: 'contain',
  },
  fileInputArea: {
    alignItems: 'center',
    marginVertical: 15,
  },
  fileButton: {
    padding: 10,
    backgroundColor: '#FFDECF',
    borderRadius: 5,
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
    backgroundColor: '#C1FFBF',
    minHeight: 250,
  },
  textInput: {
    fontSize: 20,
    color: 'black',
  },
  sendArea: {
    width: width,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green'
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
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
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
});

export default DeadlineEventScreen;
function alert(arg0: string) {
  throw new Error('Function not implemented.');
}

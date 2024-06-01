import React, { useState } from 'react';
import { Dimensions, ScrollView, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

const width = Dimensions.get("window").width;

const studyroom1Image = require('../../assets/studyroom1.png'); // 기본 알람 이미지
const studyroom2Image = require('../../assets/studyroom2.png'); // 기본 알람 이미지

const images = [studyroom1Image, studyroom2Image];
const studyroomInfo = [
  { place: '본캠퍼스', name: '스터디룸1', maxHeadCount: 12, minHeadCount: 4, image: images[0] },
  { place: '본캠퍼스', name: '스터디룸2', maxHeadCount: 12, minHeadCount: 4, image: images[0] },
  { place: '본캠퍼스', name: '스터디룸3', maxHeadCount: 12, minHeadCount: 4, image: images[0] },
  { place: '소사캠퍼스', name: '스터디룸4', maxHeadCount: 12, minHeadCount: 4, image: images[1] },
  { place: '소사캠퍼스', name: '스터디룸5', maxHeadCount: 12, minHeadCount: 4, image: images[1] },
  { place: '소사캠퍼스', name: '스터디룸6', maxHeadCount: 12, minHeadCount: 4, image: images[1] },
];
const campus = ['전체', '본캠퍼스', '소사캠퍼스'];
const time = ['09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];

const StudyRoomScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCampus, setSelectedCampus] = useState(campus[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    const currentDate = date || new Date();
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };

  const handleCampusSelect = (campusName: React.SetStateAction<string>) => {
    setSelectedCampus(campusName);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
        <Text style={styles.dateText}>{format(selectedDate, "yyyy년 M월 d일")}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="compact"
          onChange={onDateChange}
        />
      )}
      <ScrollView>
        <View style={styles.campusSelectArea}>
          {campus.map((campusName, index) => (
            <TouchableOpacity key={index} onPress={() => handleCampusSelect(campusName)}>
              <View style={[styles.campusBox, selectedCampus === campusName && styles.selectedCampus]}>
                <Text style={[styles.campusText, selectedCampus === campusName && styles.selectedCampusText]}>{campusName}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        {studyroomInfo.map((room, index) => (
          room.place === selectedCampus || selectedCampus === '전체' ? (
            <View key={index} style={styles.studyroomArea}>
              <View style={styles.infoText}>
                <Text style={styles.studyroomName}>{room.name}</Text>
                <View style={styles.studyroomHeadcount}>
                  <Text style={styles.labelText}>정원 </Text>
                  <Text style={[styles.numText, { color: 'blue' }]}>{room.maxHeadCount}</Text>
                  <Text style={styles.labelText}> 최소인원 </Text>
                  <Text style={[styles.numText, { color: 'red' }]}>{room.minHeadCount}</Text>
                </View>
              </View>
              <View style={styles.selectArea}>
                <View style={styles.imageArea}>
                  <Image style={styles.image} source={room.image} />
                </View>
                <View style={styles.timeArea}>
                  {time.map((hour, index) => (
                    <TouchableOpacity key={index}>
                      <View style={styles.timeBox}>
                        <Text style={styles.timeText}>{hour}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          ) : null
        ))}
      </ScrollView>
      <TouchableOpacity>
        <View style={styles.reserveArea}>
          <Text style={styles.reserveText}>예약하기</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  datePicker: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: 'gray',
    borderRadius: 5,
    alignItems: 'center',
  },
  dateText: {
    color: '#fff',
    fontSize: 18,
  },
  campusSelectArea: {
    borderWidth: 1,
    marginBottom: 10
  },
  campusBox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 35
  },
  campusText: {
    color: 'gray',
    fontSize: 18,
    fontWeight: 'bold'
  },
  selectedCampus: {
    backgroundColor: 'lightblue', // 선택된 캠퍼스의 배경색
  },
  selectedCampusText: {
    color: 'white', // 선택된 캠퍼스의 텍스트 색상
  },
  studyroomArea: {
    //backgroundColor: 'red',
    width: width - 10,
    height: 'auto',
    padding: 5,
    borderWidth: 1,
    marginVertical: 5
  },
  infoText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5
  },
  studyroomName: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold'
  },
  studyroomHeadcount: {
    flexDirection: 'row',
  },
  labelText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold'
  },
  numText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectArea: {
    flexDirection: 'row',
  },
  imageArea: {
    //backgroundColor: 'red',
    marginHorizontal: 10
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: 'stretch',
  },
  timeArea: {
    //backgroundColor: 'green',
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    height: 'auto',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  timeBox: {
    width: 60,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    margin: 5
  },
  timeText: {
    color: 'gray',
    fontSize: 22,
    fontWeight: 'bold'
  },
  reserveArea:{
    width: width,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgreen'
  },
  reserveText:{
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold'
  }
});

export default StudyRoomScreen;
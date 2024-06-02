import React, { useState } from 'react';
import { Dimensions, ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

const width = Dimensions.get("window").width;

const studyroom1Image = require('../../assets/studyroom1.png');
const studyroom2Image = require('../../assets/studyroom2.png');

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

const reservedTimes = {
  '2024-06-03': {
    '스터디룸1': ['09', '10', '11'],
    '스터디룸2': ['14', '15', '16'],
    '스터디룸3': ['12', '13', '14'],
    '스터디룸4': ['09', '10', '11'],
    '스터디룸5': ['17', '18', '19'],
    '스터디룸6': ['11', '12', '13'],
  },
  '2024-06-04': {
    '스터디룸1': ['10', '11', '12'],
    '스터디룸2': ['15', '16', '17'],
    '스터디룸3': ['13', '14', '15'],
    '스터디룸4': ['10', '11', '12'],
    '스터디룸5': ['18', '19', '20'],
    '스터디룸6': ['12', '13', '14'],
  },
  // 이어서 다른 날짜들 추가 가능
};

const StudyRoomScreen = () => {
  const [selectedDate, setSelectedDate] : any = useState(new Date());
  const [selectedCampus, setSelectedCampus] : any = useState(campus[0]);
  const [selectedTimes, setSelectedTimes] : any = useState({});
  const [showDatePicker, setShowDatePicker] : any = useState(false);

  const onDateChange = (event: any, date: Date) => {
    const currentDate = date || new Date();
    setShowDatePicker(false);
    setSelectedDate(currentDate);
    setSelectedTimes({}); // 날짜 변경 시 선택한 시간대 초기화
  };

  const handleCampusSelect = (campusName: React.SetStateAction<string>) => {
    setSelectedCampus(campusName);
  };

  const isConsecutive = (times: any[]) => {
    if (times.length <= 1) return true;
    const sortedTimes = times.map(Number).sort((a: number, b: number) => a - b);
    for (let i = 1; i < sortedTimes.length; i++) {
      if (sortedTimes[i] - sortedTimes[i - 1] !== 1) return false;
    }
    return true;
  };

  const handleTimeSelect = (selectedRoom: string, selectedHour: string) => {
    const roomTimes = selectedTimes[selectedRoom] || [];
    const newTimes = roomTimes.includes(selectedHour)
      ? roomTimes.filter((time: any) => time !== selectedHour)
      : [...roomTimes, selectedHour].slice(-3);

    if (newTimes.length > 3) {
      Alert.alert("예약 실패", "최대 3시간까지 연속된 시간대만 선택할 수 있습니다.");
      return;
    }

    if (!isConsecutive(newTimes)) {
      Alert.alert("예약 실패", "연속된 시간대만 선택할 수 있습니다.");
      return;
    }

    setSelectedTimes({
      ...selectedTimes,
      [selectedRoom]: newTimes,
    });
  };

  const handleReservation = () => {
    const reservationDetails = Object.entries(selectedTimes).map(([room, times] : any) => ({
      room,
      times,
    })).filter(detail => detail.times.length > 0);

    if (reservationDetails.length === 0) {
      Alert.alert("예약 실패", "시간대를 선택해주세요.");
      return;
    }

    let message = `예약된 날짜: ${format(selectedDate, "yyyy년 M월 d일")}\n`;

    reservationDetails.forEach(detail => {
      message += `스터디룸: ${detail.room}\n시간대: ${detail.times.join(', ')}시\n`;
    });

    Alert.alert("예약 성공", message);
    setSelectedTimes({});
  };

  const renderCampusSelect = () => (
    <View style={styles.campusSelectArea}>
      {campus.map((campusName, index) => (
        <TouchableOpacity key={index} onPress={() => handleCampusSelect(campusName)}>
          <View style={[styles.campusBox, selectedCampus === campusName && styles.selectedCampus]}>
            <Text style={[styles.campusText, selectedCampus === campusName && styles.selectedCampusText]}>{campusName}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const reservedTimesForSelectedDate = reservedTimes[format(selectedDate, "yyyy-MM-dd")] || {};


  const renderStudyRooms = () => (
    studyroomInfo.map((room, index) => (
      (room.place === selectedCampus || selectedCampus === '전체') && (
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
                <TouchableOpacity
                  key={index}
                  onPress={() => handleTimeSelect(room.name, hour)}
                  disabled={reservedTimesForSelectedDate[room.name]?.includes(hour)}
                >
                  <View style={[
                    styles.timeBox,
                    reservedTimesForSelectedDate[room.name]?.includes(hour) && styles.reservedTimeBox,
                    selectedTimes[room.name]?.includes(hour) && styles.selectedTimeBox
                  ]}>
                    <Text style={[
                      styles.timeText,
                      reservedTimesForSelectedDate[room.name]?.includes(hour) && styles.reservedTimeText,
                      selectedTimes[room.name]?.includes(hour) && styles.selectedTimeText
                    ]}>{hour}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )
    ))
  );

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
        {renderCampusSelect()}
        {renderStudyRooms()}
      </ScrollView>
      <TouchableOpacity onPress={handleReservation}>
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
    backgroundColor: 'skyblue',
    borderRadius: 5,
    alignItems: 'center',
  },
  dateText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  campusSelectArea: {
    alignSelf: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    marginBottom: 10,
  },
  campusBox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    paddingHorizontal: 8,
  },
  campusText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  selectedCampus: {
    backgroundColor: 'skyblue',
  },
  selectedCampusText: {
    color: 'white',
  },
  studyroomArea: {
    width: width - 10,
    padding: 5,
    borderWidth: 1,
    marginVertical: 5,
  },
  infoText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
  },
  studyroomName: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  studyroomHeadcount: {
    flexDirection: 'row',
  },
  labelText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
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
    marginHorizontal: 10,
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: 'stretch',
  },
  timeArea: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeBox: {
    width: 60,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    margin: 5,
  },
  timeText: {
    color: 'gray',
    fontSize: 22,
    fontWeight: 'bold',
  },
  selectedTimeBox: {
    backgroundColor: 'lightpink',
  },
  selectedTimeText: {
    color: 'white',
  },
  reserveArea: {
    width: width,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgreen',
  },
  reserveText: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
  },
  reservedTimeBox: {
    backgroundColor: 'lightgray'
  },
  reservedTimeText: {

  }

});

export default StudyRoomScreen;
import React, { useState, useEffect } from 'react';
import { Dimensions, ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import config from '../../config';
import { UserData } from '../../types/type';
import { useFocusEffect } from '@react-navigation/native';

export type BuildingData = {
  [x: string]: any;
  study_room_id: number,
  campus_place: string,
  study_room_name: string,
};

const width = Dimensions.get("window").width;

const studyroom1Image = require('../../assets/studyroom1.png');
const studyroom2Image = require('../../assets/studyroom2.png');

const images = [studyroom1Image, studyroom2Image];

const time = ['09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];

const StudyRoomScreen = ({ route, navigation}: any) => {
  const { userdata } = route.params;
  const [campus, setCampus] = useState<string[]>(['전체']);
  const [selectedDate, setSelectedDate]: any = useState(new Date());
  const [selectedCampus, setSelectedCampus]: any = useState(campus[0]);
  const [selectedTimes, setSelectedTimes]: any = useState({});
  const [showDatePicker, setShowDatePicker]: any = useState(false);
  const [schoolBuildingData, setSchoolBuildingData] = useState<BuildingData[]>();
  const [studyroomInfo, setStudyroomInfo] = useState<{ place: string, name: string, maxHeadCount: number, minHeadCount: number, image: any }[]>([]);
  const [reservedTimes, setReservedTimes] = useState<{ [key: string]: { [key: string]: string[] } }>({});

  const fetchStudyRoomData = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/get_study_room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student: userdata.student_pk
        })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('과목 가져오기 실패:', error);
    }
  };
  

  const get_campus_place = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/get_campus_place`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campus_id: userdata.campus_pk,
        })
      });
      const campusplace = await response.json();
      const campusPlace = campusplace;
      setSchoolBuildingData(campusPlace);

      const campusPlaces = ['전체', ...new Set(campusPlace.map((data: BuildingData) => data.campus_place))] as string[];
      setCampus(campusPlaces);

    } catch (error) {
      console.error('학교 캠퍼스 스터디룸 정보 가져오기 실패:', error);
    }
  }

  const fetchData = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/get_study_date_time`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      const reservedTimesData: { [key: string]: { [key: string]: string[] } } = {};
      data.forEach((item: any) => {
        const formattedDate = format(new Date(item.study_room_date), 'yyyy-MM-dd');
        if (!reservedTimesData[formattedDate]) {
          reservedTimesData[formattedDate] = {};
        }
        if (!reservedTimesData[formattedDate][item.study_room_name]) {
          reservedTimesData[formattedDate][item.study_room_name] = [];
        }
        reservedTimesData[formattedDate][item.study_room_name].push(...item.study_room_time.split(','));  // 문자열 분할하여 배열로 저장
      });
  
      setReservedTimes(reservedTimesData); // 예약 정보를 reservedTimes 상태로 업데이트
      console.log(data); 
    } catch (error) {
      console.error('데이터를 불러오는 중 오류 발생:', error);
    }
  };

  const updateReservedTimes = (studyRoomDate: string, studyRoomName: string, studyRoomTimes: string[]) => {
    setReservedTimes(prevState => {
      const updatedReservedTimes = { ...prevState };
      if (!updatedReservedTimes[studyRoomDate]) {
        updatedReservedTimes[studyRoomDate] = {};
      }
      // 시간을 배열 형태로 업데이트
      updatedReservedTimes[studyRoomDate][studyRoomName] = [...(updatedReservedTimes[studyRoomDate][studyRoomName] || []), ...studyRoomTimes];
      return updatedReservedTimes;
    });
  };

  const insert_user_study_room = async (studyRoomId: number, studyRoomDate: string, studyRoomTime: string) => {
    try {
      const response = await fetch(`${config.serverUrl}/studyroomReservation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student: userdata.student_pk,
          study_room: studyRoomId,
          study_room_date: studyRoomDate,
          study_room_time: studyRoomTime,
        })
      });
      console.log("스터디룸 예약 성공");
      const value = await response.json();
    } catch (error) {
      console.error('스터디룸 예약 실패!', error);
    }
  }

  useEffect(() => {
    if (schoolBuildingData) {
      const buildingData = schoolBuildingData.map((room: BuildingData) => ({
        place: room.campus_place,
        name: room.study_room_name,
        maxHeadCount: 12,
        minHeadCount: 4,
        image: images[0]
      }));
      setStudyroomInfo(buildingData);
    }
  }, [schoolBuildingData]);

  const onDateChange = (event: any, date?: Date) => {
    const currentDate = date || new Date();
    setShowDatePicker(false);
    setSelectedDate(currentDate);
    setSelectedTimes({});
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
    const reservationDetails = Object.entries(selectedTimes).map(([room, times]: any) => ({
      room,
      times: times.sort(),
    })).filter(detail => detail.times.length > 0);
  
    if (reservationDetails.length === 0) {
      Alert.alert("예약 실패", "시간대를 선택해주세요.");
      return;
    }
  
    let message = `예약된 날짜: ${format(selectedDate, "yyyy년 M월 d일")}\n`;
  
    if (schoolBuildingData) {
      reservationDetails.forEach(detail => {
        const selectedRoomInfo = studyroomInfo.find(room => room.name === detail.room);
        if (selectedRoomInfo) {
          const selectedBuilding = schoolBuildingData.find((building: BuildingData) => building.study_room_name === detail.room);
          if (selectedBuilding) {
            const studyRoomId = selectedBuilding.study_room_id;
            const studyRoomDate = format(selectedDate, "yyyy-MM-dd");
            const studyRoomTime = detail.times.join(',');
  
            message += `스터디룸: ${selectedRoomInfo.place} ${selectedRoomInfo.name}\n시간대: ${detail.times.join(', ')}시\n`;
            console.log(studyRoomDate)
            insert_user_study_room(studyRoomId, studyRoomDate, studyRoomTime);
            updateReservedTimes(studyRoomDate, detail.room, detail.times);  // 배열로 전달
          }
        }
      });
    } else {
      console.error('학교 건물 데이터가 없습니다.');
    }
  
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
  console.log(reservedTimes)
  useEffect(() => {
    get_campus_place();
    fetchStudyRoomData();
    fetchData();
  }, []);

  

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={styles.selectedDateText}>{format(selectedDate, "yyyy년 M월 d일")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style = {{height : 30, width : 60, backgroundColor : 'blue'}} onPress={() => navigation.navigate("StudyRoomDetailScreen")}></TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>
      <View style={styles.body}>
        {renderCampusSelect()}
        {renderStudyRooms()}
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.reserveButton} onPress={handleReservation}>
          <Text style={styles.reserveButtonText}>예약하기</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  selectedDateText: {
    fontSize: 18,
    color: '#333',
  },
  body: {
    padding: 20,
  },
  campusSelectArea: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  campusBox: {
    padding: 10,
    margin: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  selectedCampus: {
    backgroundColor: '#007BFF',
  },
  campusText: {
    color: '#333',
  },
  selectedCampusText: {
    color: '#fff',
  },
  studyroomArea: {
    marginBottom: 20,
  },
  infoText: {
    marginBottom: 10,
  },
  studyroomName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  studyroomHeadcount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelText: {
    fontSize: 14,
    color: '#333',
  },
  numText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectArea: {
    flexDirection: 'row',
  },
  imageArea: {
    marginRight: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  timeArea: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  timeBox: {
    width: 50,
    padding: 10,
    margin: 5,
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  reservedTimeBox: {
    backgroundColor: '#d9534f',
  },
  selectedTimeBox: {
    backgroundColor: '#5cb85c',
  },
  timeText: {
    color: '#333',
  },
  reservedTimeText: {
    color: '#fff',
  },
  selectedTimeText: {
    color: '#fff',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  reserveButton: {
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  reserveButtonText: {
    color: '#fff',
    fontSize: 18,
  },

});

export default StudyRoomScreen;

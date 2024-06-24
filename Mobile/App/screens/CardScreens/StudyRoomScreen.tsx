import React, { useState, useEffect } from 'react';
import { Dimensions, ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import config from '../../config';
import { endOfMonth } from 'date-fns';
import ImageCropPicker from 'react-native-image-crop-picker';

const width = Dimensions.get("window").width;

const time = ['09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];


export type BuildingData = {
  [x: string]: any;
  study_room_id: number,
  campus_place: string,
  study_room_name: string,
  image : any
};

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
      //console.log(campusPlace)
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
      //console.log(data); 
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
      //console.log("스터디룸 예약 성공");
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
        image: room.image 
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
    const reservedTimesForSelectedDate = reservedTimes[format(selectedDate, "yyyy-MM-dd")] || {};
    
    for (const roomName in selectedTimes) {
      const roomTimes = selectedTimes[roomName];
      if (roomName !== selectedRoom && roomTimes.includes(selectedHour)) {
        Alert.alert("예약 실패", "이미 해당 시간에 다른 스터디룸이 예약되어 있습니다.");
        return; 
      }
    }    
    const roomTimes = selectedTimes[selectedRoom] || [];
    const newTimes = roomTimes.includes(selectedHour)
      ? roomTimes.filter((time: any) => time !== selectedHour)
      : [...roomTimes, selectedHour].slice(-3);
  
    // 최대 예약 가능한 시간을 초과하는지 확인합니다.
    if (newTimes.length > 3) {
      Alert.alert("예약 실패", "최대 3시간까지 연속된 시간대만 선택할 수 있습니다.");
      return;
    }
  
    // 연속된 시간을 선택했는지 확인합니다.
    if (!isConsecutive(newTimes)) {
      Alert.alert("예약 실패", "연속된 시간대만 선택할 수 있습니다.");
      return;
    }
  
    // 선택한 시간을 상태에 업데이트합니다.
    setSelectedTimes({
      ...selectedTimes,
      [selectedRoom]: newTimes,
    });
  };
  
  const handleReservation = () => {
    // 선택한 날짜에 대한 이미 예약된 시간 정보를 가져옵니다.
    const reservedTimesForSelectedDate = reservedTimes[format(selectedDate, "yyyy-MM-dd")] || {};
  
    // 선택한 날짜에 이미 스터디룸 예약이 있는 경우, 예약을 실패하고 함수를 종료합니다.
    if (Object.keys(reservedTimesForSelectedDate).length > 0) {
      Alert.alert("예약 실패", "이미 해당 날짜에 스터디룸을 예약하셨습니다.");
      return;
    }
  // 예약 가능한 경우에만 예약 처리를 진행합니다.
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
              <Image style={styles.image} source={{uri: `${config.photoUrl}/${room.image}.png` }} />
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
  
  useEffect(() => {
    get_campus_place();
    fetchData();
  }, []);
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={styles.selectedDateText}>{format(selectedDate, "yyyy년 M월 d일")}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="compact"
              minimumDate={new Date()}
              maximumDate={endOfMonth(new Date())}
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
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
    header: {
      padding: 20,
      backgroundColor: '#F5B959',
      alignItems: 'center',
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
  selectedDateText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
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
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  selectedCampus: {
    backgroundColor: '#007BFF',
  },
  campusText: {
    color: '#333',
    fontWeight: 'bold',
  },
  selectedCampusText: {
    color: '#fff',
  },
  studyroomArea: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  infoText: {
    marginBottom: 10,
  },
  studyroomName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  studyroomHeadcount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelText: {
    fontSize: 16,
    color: '#333',
  },
  numText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectArea: {
    flexDirection: 'row',
  },
  imageArea: {
    marginRight: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  timeArea: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  timeBox: {
    width: 60,
    padding: 10,
    margin: 3,
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  reservedTimeBox: {
    backgroundColor: '#d9534f',
  },
  selectedTimeBox: {
    backgroundColor: '#5cb85c',
  },
  timeText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
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
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  reserveButton: {
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  reserveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StudyRoomScreen;

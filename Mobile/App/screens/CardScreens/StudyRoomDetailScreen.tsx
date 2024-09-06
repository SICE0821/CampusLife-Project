import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import IconA from 'react-native-vector-icons/FontAwesome5';
import config from '../../config';

type StudyRoomInfo = {
  student: number,
  study_room_date: string,
  study_room_name: string,
  study_room_time: string,
  image: string,
}

type GroupedStudyRoomInfo = {
  [key: string]: StudyRoomInfo[];
}

const StudyRoomDetailScreen = ({ route }: any) => {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [groupedStudyRoomInfo, setGroupedStudyRoomInfo] = useState<GroupedStudyRoomInfo>({});
  const { userdata } = route.params;

  const toggleExpand = (date: string) => {
    setExpanded(prevState => ({
      ...prevState,
      [date]: !prevState[date]
    }));
  };

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

  const deleteStudyRoom = async (student: number, study_room_name: string, study_room_date: string, study_room_time: string) => {
    try {
      const response = await fetch(`${config.serverUrl}/deletestudyroom`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student,
          study_room_name,
          study_room_date,
          study_room_time,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      //console.log('스터디룸 삭제 성공:', result);
      await fetchAndGroupData();
    } catch (error) {
      console.error('스터디룸 삭제 실패:', error);
    }
  };

  const confirmDelete = (student: number, study_room_name: string, study_room_date: string, study_room_time: string) => {
    Alert.alert(
      "삭제 확인",
      "삭제하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel"
        },
        {
          text: "확인",
          onPress: () => deleteStudyRoom(student, study_room_name, study_room_date, study_room_time)
        }
      ],
      { cancelable: false }
    );
  };

  const fetchAndGroupData = async () => {
    const data = await fetchStudyRoomData();
    const groupedData = groupByDate(data);
    setGroupedStudyRoomInfo(groupedData);
  };
  
  useEffect(() => {
    const fetchDataAsync = async () => {
        try {
          fetchAndGroupData();
        } catch (error) {
            console.error('Error fetching data:', error); 
        }
    };
    fetchDataAsync(); 
}, []);



  const groupByDate = (data: StudyRoomInfo[]): GroupedStudyRoomInfo => {
    const groupedData = data.reduce((acc: GroupedStudyRoomInfo, item: StudyRoomInfo) => {
      (acc[item.study_room_date] = acc[item.study_room_date] || []).push(item);
      return acc;
    }, {});

    const sortedGroupedData = Object.keys(groupedData)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .reduce((acc: GroupedStudyRoomInfo, key: string) => {
        acc[key] = groupedData[key];
        return acc;
      }, {});

    return sortedGroupedData;
  };

  const currentDate = new Date();

  return (
    <ScrollView style={styles.container}>
      {Object.keys(groupedStudyRoomInfo).map((date, index) => (
        <View key={index} style={styles.infoContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{date}</Text>
            <TouchableOpacity style={styles.iconContainer} onPress={() => toggleExpand(date)}>
              <IconA name="chevron-down" size={24} color="black" />
            </TouchableOpacity>
          </View>
          {expanded[date] && groupedStudyRoomInfo[date].map((room, idx) => (
            <View key={idx}>
              <View style={styles.additionalInfo}>
                <Image style={styles.image} source={{ uri: `${config.photoUrl}/${room.image}.png` }} />
                <View style={styles.info}>
                  <Text style={styles.label}>시간: {room.study_room_time.split(',').map(time => `${time.trim()}시`).join(', ')}</Text>
                  <Text style={styles.label}>예약자: {userdata.name}</Text>
                  <Text style={styles.label}>장소: {room.study_room_name}</Text>
                </View>
              </View>
              {new Date(room.study_room_date) > currentDate && (
                <>
                  <View style={{ borderWidth: 0.5, borderColor: "grey", marginTop: 10 }}></View>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => confirmDelete(userdata.student_pk, room.study_room_name, room.study_room_date, room.study_room_time)}
                  >
                    <Text style={{ fontSize: 18, color: 'black' }}>취소하기</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  infoContainer: {
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  titleContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'flex-end',
  },
  additionalInfo: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginLeft: 10,
  },
  info: {
    flex: 1,
    marginLeft: 15,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black',
    marginTop: 5,
    marginLeft: 10,
  },
  cancelButton: {
    alignItems: 'center',
    marginTop: 15,
    borderRadius: 7,
    paddingVertical: 8,
    backgroundColor: '#b3b4ae',
  },
});

export default StudyRoomDetailScreen;

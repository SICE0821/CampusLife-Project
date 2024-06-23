import { View, StyleSheet, Dimensions, Image, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Icon_event from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { UserData, AdminEventList, VoteEvnetData, VoteInfoItem, VoteDataItem } from '../../types/type'
const width = Dimensions.get("window").width;
import config from '../../config';

const CheckEventScreen = ({ route, navigation }: any) => {
  const { userdata } = route.params;
  const [userData, setUserData] = useState<UserData>(userdata); //유저 데이터
  const [eventList, setEventList] = useState<AdminEventList[]>([]); //이벤트 리스트
  const [voteData, setVoteData] = useState<VoteDataItem[]>([]);
  const [voteInfo, setVoteInfo] = useState<VoteInfoItem[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      setUserData(userdata);
      GetEventList();
      GetEventVote();
    }, [])
  );

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
      //console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
    }
  }


  //해당 이벤트 초기화 후 다시 행삽입
  const DeleteEvent = async (eventId: any) => {
    try {
      const response = await fetch(`${config.serverUrl}/DeleteEvent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: eventId
        }),
      })
      //GetEventList();
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  //설정한 이벤트 보여주기
  const GetEventVote = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/GetEventVote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campus_id: userData.campus_pk
        }),
      })
      const data : VoteEvnetData[] = await response.json();
      const groupedData : any = {};

      // rawData를 순회하여 groupedData 객체에 이벤트별로 그룹화
      data.forEach(item => {
        if (!groupedData[item.event_id]) {
          groupedData[item.event_id] = {
            votes: [],
            results: []
          };
        }
        groupedData[item.event_id].votes[item.vote_index - 1] = item.vote_name;
        groupedData[item.event_id].results[item.vote_index - 1] = item.vote_count;
      });

      // 결과 배열 초기화
      const voteInfo : any = [];
      const voteData : any = [];

      // groupedData 객체를 순회하여 voteInfo와 voteData 배열을 생성
      Object.keys(groupedData).forEach(event_id => {
        const { votes, results } = groupedData[event_id];

        // 투표 항목이 비어 있는 경우 기본 값을 설정
        for (let i = 0; i < votes.length; i++) {
          if (!votes[i]) {
            votes[i] = `투표 항목${i + 1}`;
          }
        }

        voteInfo.push({
          id: parseInt(event_id, 10),
          votes: votes
        });

        voteData.push({
          id: parseInt(event_id, 10),
          results: results
        });
      });

      setVoteData(voteData);
      setVoteInfo(voteInfo);
      console.log('voteInfo:', voteInfo);
      console.log('voteData:', voteData);
      //console.log(data);
      //console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  const handleEditEvent = (eventId: number) => {
    navigation.navigate("EventEditScreen", { userdata, eventId })
  };

  const handleDeleteEvent = (eventId: number) => {
    Alert.alert(
      "이벤트 삭제",
      "해당 이벤트를 정말 삭제 하시겠습니까??",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK", onPress: () => {
            DeleteEvent(eventId)
            GetEventList()
          }
        }
      ]
    );
  };

  const calculatePercentages = (votes: any[], results: any[]) => {
    const totalVotes = results.reduce((acc, count) => acc + count, 0);
    return votes.map((vote, index) => ({
      vote,
      count: results[index],
      percentage: totalVotes === 0 ? 0 : (results[index] / totalVotes) * 100
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.btnArea}>
        <TouchableOpacity style={styles.eventBtn} onPress={() => navigation.navigate("EventRegistrationScreen", userdata)}>
          <Icon_event style={styles.eventRegistIcon} name='note-plus-outline' />
          <Text style={styles.eventRegistText}>이벤트 등록</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.eventBtn} onPress={() => navigation.navigate("SendUserEventScreen", userdata)}>
          <Icon_event style={styles.eventRegistIcon} name='note-text-outline' />
          <Text style={styles.eventCheckText}>참여 확인</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {eventList?.map((event) => {
          const votes = voteInfo.find(vote => vote.id === event.event_id)?.votes || [];
          const results = voteData.find(vote => vote.id === event.event_id)?.results || [];
          const percentages = calculatePercentages(votes, results);

          return (

            <View key={event.event_id} style={styles.eventBox}>
              <View style={styles.eventImageArea}>
                <Image style={styles.image} source={{ uri: `${config.photoUrl}/${event?.event_photo}.png` }} />
              </View>
              <View style={styles.eventInfo}>
                <View style={styles.eventInfoTextArea}>
                  <Text style={styles.eventTitle}>{event.name}</Text>
                  <Text style={styles.eventContent}>{event.info}</Text>
                  {percentages.map((vote, index) => (
                    vote.vote !== 'null' && (
                      <View key={index} style={styles.voteResult}>
                        <Text style={styles.voteText}>{vote.vote}</Text>
                        <View style={styles.voteTextArea}>
                          <Text style={styles.voteText}>{vote.count} 표</Text>
                          <Text style={styles.voteText}>({vote.percentage.toFixed(1)}%)</Text>
                        </View>
                      </View>
                    )
                  ))}

                  <Text style={styles.DeadLineDate}>{event.start_date} ~ {event.close_date}</Text>
                </View>
                <View style={styles.eventBoxBtnArea}>
                  <TouchableOpacity style={styles.eventBoxBtn} onPress={() => handleEditEvent(event.event_id)}>
                    <Text style={styles.eventBoxBtnText}>이벤트 수정</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.eventBoxBtn} onPress={() => handleDeleteEvent(event.event_id)}>
                    <Text style={styles.eventBoxBtnText}>이벤트 삭제</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
        <View style={{ height: 100 }}></View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  btnArea: {
    width: width * 0.95,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 10
  },
  eventBtn: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    marginHorizontal: 5,
    borderRadius: 10,
    elevation: 5
  },
  eventRegistIcon: {
    color: 'black',
    fontSize: 30
  },
  eventRegistText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold'
  },
  eventCheckText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold'
  },
  eventBox: {
    backgroundColor: 'white',
    width: width * 0.95,
    flexDirection: 'row',
    borderRadius: 15,
    marginVertical: 5,
    elevation: 5,
  },
  eventImageArea: {
    backgroundColor: '#dddddd',
    width: 150,
    height: 150,
    alignSelf: 'flex-start',
    borderRadius: 15
  },
  image: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
    borderRadius: 15
  },
  eventInfo: {
    width: width * 0.95 - 150,
    justifyContent: 'space-between',
    padding: 5
  },
  eventInfoTextArea: {
    width: '100%',
  },
  eventTitle: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold'
  },
  eventContent: {
    color: 'black',
    fontSize: 14,
    marginVertical: 5
  },
  DeadLineDate: {
    color: 'grey',
    marginTop: 10,
    fontSize: 15,
  },
  voteResult: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
    paddingHorizontal: 5
  },
  voteTextArea: {
    width: '35%',
    //backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5
  },
  voteText: {
    fontSize: 14,
    color: 'black'
  },
  eventBoxBtnArea: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5
  },
  eventBoxBtn: {
    backgroundColor: 'skyblue',
    width: 100,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    padding: 5,
    borderRadius: 10,
    elevation: 3
  },
  eventBoxBtnText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default CheckEventScreen;

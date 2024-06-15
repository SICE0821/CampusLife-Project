import React from 'react';
import { View, StyleSheet, Dimensions, Image, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Icon_event from 'react-native-vector-icons/MaterialCommunityIcons';

const width = Dimensions.get("window").width;

const eventData = [
  { id: 1, image: require('../../assets/friend3.png'), title: 'Event Name 1', content: 'Event Content 1' },
  { id: 2, image: require('../../assets/friend3.png'), title: 'Event Name 2', content: 'Event Content 2' },
];

const voteInfo = [
  { id: 1, votes: ['투표 항목1', '투표 항목2', '투표 항목3', '투표 항목4', '투표 항목5'] },
  { id: 2, votes: ['투표 항목1', '투표 항목2'] },
];

const voteData = [
  { id: 1, results: [50, 12, 43, 52, 1] },
  { id: 2, results: [21, 12] },
];

const CheckEventScreen = ({ route, navigation } : any) => {
  const handleEditEvent = (eventId: number) => {
    Alert.alert("Edit Event", `Edit event with ID: ${eventId}`);
  };

  const handleDeleteEvent = (eventId: number) => {
    Alert.alert(
      "Delete Event",
      "Are you sure you want to delete this event?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => console.log(`Event with ID: ${eventId} deleted`) }
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
        <TouchableOpacity style={styles.eventBtn} onPress={() => navigation.navigate("EventRegistrationScreen")}>
          <Icon_event style={styles.eventRegistIcon} name='note-plus-outline' />
          <Text style={styles.eventRegistText}>이벤트 등록</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.eventBtn} onPress={() => navigation.navigate("SendUserEventScreen")}>
          <Icon_event style={styles.eventRegistIcon} name='note-text-outline' />
          <Text style={styles.eventCheckText}>참여 확인</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {eventData.map((event) => {
          const votes = voteInfo.find(vote => vote.id === event.id)?.votes || [];
          const results = voteData.find(vote => vote.id === event.id)?.results || [];
          const percentages = calculatePercentages(votes, results);

          return (
            <View key={event.id} style={styles.eventBox}>
              <View style={styles.eventImageArea}>
                <Image style={styles.image} source={event.image} />
              </View>
              <View style={styles.eventInfo}>
                <View style={styles.eventInfoTextArea}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventContent}>{event.content}</Text>
                </View>
                <View>
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
                </View>
                <View style={styles.eventBoxBtnArea}>
                  <TouchableOpacity style={styles.eventBoxBtn} onPress={() => handleEditEvent(event.id)}>
                    <Text style={styles.eventBoxBtnText}>이벤트 수정</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.eventBoxBtn} onPress={() => handleDeleteEvent(event.id)}>
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
    elevation: 5
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

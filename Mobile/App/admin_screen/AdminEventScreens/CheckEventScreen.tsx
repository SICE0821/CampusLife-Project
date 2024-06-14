import React from 'react';
import { View, StyleSheet, Dimensions, Image, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Icon_event from 'react-native-vector-icons/MaterialCommunityIcons';

const width = Dimensions.get("window").width;

const eventData = [
  { id: 1, image: require('../../assets/friend3.png'), title: 'Event Name 1', content: 'Event Content 1' },
  { id: 2, image: require('../../assets/friend3.png'), title: 'Event Name 2', content: 'Event Content 2' },

];

const CheckEventScreen = ({ route, navigation }: any) => {
  const { userdata } = route.params;
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
        {eventData.map((event) => (
          <View key={event.id} style={styles.eventBox}>
            <View style={styles.eventImageArea}>
              <Image style={styles.image} source={event.image} />
            </View>
            <View style={styles.eventInfo}>
              <View style={styles.eventInfoTextArea}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventContent}>{event.content}</Text>
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
        ))}
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
    alignSelf: 'center',
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
  eventBoxBtnArea: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center'
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

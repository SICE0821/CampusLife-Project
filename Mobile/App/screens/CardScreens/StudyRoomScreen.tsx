import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, StyleSheet, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';

const StudyRoomScreen = ({ navigation }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [bookings, setBookings] = useState({});
  const [cancelledTimeSlots, setCancelledTimeSlots] = useState([]); // 추가: 취소된 예약 시간대를 관리하는 상태 변수
  const rooms = ['(본교 몽당도서관 3층) 스터디룸1', '(본교 몽당도서관 3층) 스터디룸2', '학과 스터디룸 1', '학과 스터디룸 2'];
  const timeSlots = [
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
    '17:00 - 18:00',
  ];

  useEffect(() => {
    // Fetch existing bookings from the database when the component mounts
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('YOUR_API_ENDPOINT'); // Replace with your API endpoint
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleDayPress = (day) => {
    const today = new Date();
    const selectedDate = new Date(day.dateString);
    if (selectedDate <= today) {
      Alert.alert('Invalid Date', 'You can only select dates from tomorrow onwards.');
      return;
    }
    setSelectedDay(day.dateString);
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  const handleTimeSlotSelect = (timeSlot) => {
    // 예약된 시간대는 선택할 수 없도록 함
    if (bookings[selectedDay]?.[selectedRoom]?.[timeSlot]) {
      Alert.alert('Already Booked', 'This time slot has already been booked. Please select an available time slot.');
      return;
    }

    if (selectedTimeSlots.includes(timeSlot)) {
      setSelectedTimeSlots(selectedTimeSlots.filter((slot) => slot !== timeSlot));
    } else {
      setSelectedTimeSlots([...selectedTimeSlots, timeSlot]);
    }
  };

  const handleBooking = async () => {
    if (!selectedDay || !selectedRoom || selectedTimeSlots.length === 0) {
      Alert.alert('Incomplete Information', 'Please select a date, room, and at least one time slot to complete the booking.');
      return;
    }

    const allBooked = selectedTimeSlots.every((timeSlot) => {
      return !bookings[selectedDay]?.[selectedRoom]?.[timeSlot];
    });

    if (!allBooked) {
      Alert.alert('Already Booked', 'One or more selected time slots have already been booked. Please select available time slots.');
      return;
    }

    const updatedBookings = { ...bookings }; // 예약 하기 ~~~~~~~~~~~~~~~~
    selectedTimeSlots.forEach((timeSlot) => {
      if (!updatedBookings[selectedDay]) {
        updatedBookings[selectedDay] = {};
      }
      if (!updatedBookings[selectedDay][selectedRoom]) {
        updatedBookings[selectedDay][selectedRoom] = {};
      }
      updatedBookings[selectedDay][selectedRoom][timeSlot] = true;
    });

    try {
      await axios.post('YOUR_API_ENDPOINT', { // Replace with your API endpoint
        date: selectedDay,
        room: selectedRoom,
        timeSlots: selectedTimeSlots,
      });
      setBookings(updatedBookings);
      setSelectedTimeSlots([]);
      Alert.alert('Booking Successful', `Your reservations for ${selectedRoom} on ${selectedDay} at the selected time slots have been confirmed.`);
    } catch (error) {
      console.error('Error making booking:', error);
      Alert.alert('Booking Failed', 'There was an error processing your booking. Please try again.');
    }
  };

  const cancelBooking = async (timeSlot) => {  // 예약 취소~~~~~~~~~~~
    const updatedBookings = { ...bookings };
    delete updatedBookings[selectedDay]?.[selectedRoom]?.[timeSlot];
    setBookings(updatedBookings);

    setCancelledTimeSlots([...cancelledTimeSlots, timeSlot]); // 취소된 예약 시간대를 추가

    try {
      await axios.delete('YOUR_API_ENDPOINT', { // Replace with your API endpoint
        data: {
          date: selectedDay,
          room: selectedRoom,
          timeSlot: timeSlot,
        },
      });
      Alert.alert('Booking Cancelled', `Your reservation for ${selectedRoom} on ${selectedDay} at ${timeSlot} has been cancelled.`);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      Alert.alert('Cancellation Failed', 'There was an error processing your cancellation. Please try again.');
    }
  };

  const renderRoom = ({ item }) => (
    <View style={{marginLeft:10, marginRight:10}}>
      <TouchableOpacity
      style={[
        styles.roomButton,
        selectedRoom === item ? styles.selectedRoom : null,
      ]}
      onPress={() => handleRoomSelect(item)}
    >
      <Text style={styles.roomText}>{item}</Text>
    </TouchableOpacity>
    </View>
    
  );

  const renderTimeSlot = ({ item }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity
        style={[
          styles.timeSlot,
          selectedTimeSlots.includes(item) ? styles.selectedTimeSlot : null,
          bookings[selectedDay]?.[selectedRoom]?.[item] ? styles.booked : null,
          cancelledTimeSlots.includes(item) ? styles.cancelled : null,
        ]}
        onPress={() => handleTimeSlotSelect(item)}
        disabled={bookings[selectedDay]?.[selectedRoom]?.[item]}
      >
        <Text style={styles.timeSlotText}>{item}</Text>
      </TouchableOpacity>
      {bookings[selectedDay]?.[selectedRoom]?.[item] && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => cancelBooking(item)}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );



  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 20);


  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        minDate={minDate}
        maxDate={maxDate} // 최대 선택 가능한 날짜 범위 설정
        monthFormat={'M월'}
        markedDates={{
          ...Object.keys(bookings).reduce((acc, date) => {
            acc[date] = { marked: true, dotColor: 'blue' };
            return acc;
          }, {}),
          ...(selectedDay ? { [selectedDay]: { selected: true, selectedColor: 'blue' } } : {}),
        }}
      />

      {selectedDay && (
        <>
          <View style={styles.roomsContainer}>
            <Text style={styles.roomsTitle}>선택된 날짜 : {selectedDay}</Text>
            <FlatList
              horizontal
              data={rooms}
              renderItem={renderRoom}
              keyExtractor={(item) => item}
            />
          </View>
          {selectedRoom && (
            <>
              <Text style={styles.timeSlotsTitle}>선택된 스터디 룸 : {selectedRoom}</Text>
              <FlatList
                data={timeSlots}
                renderItem={renderTimeSlot}
                keyExtractor={(item) => item}
                numColumns={3} // time slots in rows of 3, change as needed
                contentContainerStyle={styles.timeSlotsContainer}
              />
            </>
          )}
          {selectedTimeSlots.length > 0 && (
            <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
              <Text style={styles.bookButtonText}>예약하기</Text>
            </TouchableOpacity>
          )}
        </>
      )}
      <View style={styles.bottomArea}>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  roomsContainer: {
    height: 135,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    alignSelf: 'center'
  },
  roomsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  roomButton: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
  selectedRoom: {
    backgroundColor: '#add8e6',
  },
  roomText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timeSlotsContainer: {
    paddingVertical: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  timeSlotsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  timeSlot: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
  booked: {
    backgroundColor: '#d3d3d3',
  },
  timeSlotText: {
    fontSize: 16,
    textAlign: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: '#7fffd4',
  },
  bookButton: {
    backgroundColor: '#4169e1',
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  bottomArea: {
    width: '100%',
    height: 80,
  },
});


export default StudyRoomScreen;

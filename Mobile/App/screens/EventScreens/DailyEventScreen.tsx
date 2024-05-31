import React, { useEffect, useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TouchableHighlight } from 'react-native';

const DailyEventScreen = (naviagation : any) => {
  const today = new Date();
  const year = today.getFullYear().toString();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  const todayString = `${year}-${month}-${day}`;

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    useEffect(() => {

    }, []);

  const [markedDates, setMarkedDates] = useState({
    [todayString]: { marked: true },
    '2024-04-08': { selected: true, selectedColor: "orange" },
    '2024-04-15': { selected: true, selectedColor: "orange" } 
  });

  const [checkToday, setCheckToday] = useState(true);

  const handleButtonPress = () => {
    if (checkToday){
      setIsModalVisible(true);
      setMarkedDates(prevMarkedDates => ({
        ...prevMarkedDates,
        [todayString]: { selected: true, selectedColor: "orange" },
      }));

      console.log(checkToday);
      setCheckToday(false);
    }
  };

  const onPressModalClose = () => {
    setIsModalVisible(false);
}

  return (
    <View style={styles.screenView}>
      <Modal animationType='fade' transparent={true} visible={isModalVisible}>
          <View style={styles.modalBackground}>
            <View style={styles.modalView}>
              <Text style={styles.modalFont}>포인트 100 흭득!</Text>
              <TouchableHighlight onPress={onPressModalClose}>
                <Text style={styles.modalclose}>나가기</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>

      <View style={styles.topView}>
        <Text style={styles.title}>출석체크</Text>
        <Text style={styles.subtitle}>매일 매일 100P를 받으세요!</Text>
      </View>
      <View>
        <Calendar
          style={styles.calendar}
          theme={{
            todayTextColor: 'black',
            textDayFontSize: 20,
            textDayFontWeight: 'bold',
            textMonthFontSize: 30,
            textMonthFontWeight: 'bold',
            weekVerticalMargin: 15,
            //textSectionTitleColor: 'rgba(138, 138, 138, 1)',
          }}
          markedDates={markedDates}
          hideExtraDays={false}
          monthFormat={'M월'}
          hideDayNames={true}
          showSixWeeks={true}
        />
      </View>
      <TouchableOpacity style={styles.button1} onPress={handleButtonPress}>
        <Text style={styles.buttonText}>출석체크</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screenView: {
    width: '100%',
    height: '90%'
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalView: {
    backgroundColor: 'white',
    width: '70%',
    height: '15%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  modalFont: {
    marginTop: 15,
    fontSize: 30,
    color: 'black',
    fontWeight: 'bold',
  },
  modalclose: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  topView: {
    height: '20%',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    margin: 20,
    marginBottom: 15,
    color: 'black',
  },
  subtitle: {
    fontSize: 20,
    color: 'black'
  },
  calendar: {
    //height: 300,
    alignSelf: 'center',
    width: '95%',
    borderWidth: 5,
    borderColor: '#E9E9E9',
    borderRadius: 20,
  },
  button1: {
    backgroundColor: 'orange',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 100,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 28,
    fontWeight: 'bold',
    
  },
});

export default DailyEventScreen;
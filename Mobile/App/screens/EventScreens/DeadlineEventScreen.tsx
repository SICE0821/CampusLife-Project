import React from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-swiper';

const photopng = require('../../assets/photo.png');

const DeadlineEventScreen : React.FC = () => {

  const navigation = useNavigation();

  const handleButtonPress = () => {
    // 버튼이 눌렸을 때 실행할 동작을 정의합니다.
    // 예를 들어 다른 화면으로 이동하거나, 특정 함수를 호출하는 등의 동작을 수행할 수 있습니다.
    // navigation.navigate('TargetScreen'); // 다른 화면으로 이동하는 예시
  };

  return (
      <View style = {{flex : 1, backgroundColor : 'white'}}>
        <View style={styles.eventBox1}>
          <Text style={styles.title}>대학 촬영 대회</Text>
          <Text style={styles.subtitle}>대학 경치를 촬영해 응모! 수상자는 포인트 지급!</Text>
          <Image style={styles.imageStyle} source={photopng}/>
        </View>
        <TouchableOpacity style={styles.button1} onPress={handleButtonPress}>
          <Text style={styles.buttonText}>사진 공유하러 가기</Text>
        </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
  eventBox1: {
    width: 350,
    height: 450,
    marginTop: 30,
    backgroundColor: '#33DEC3',
    borderRadius: 40,
    alignSelf: 'center'
  },
  eventBox2: {
    width: 350,
    height: 450,
    marginTop: 30,
    backgroundColor: '#C1FFBF',
    borderRadius: 40,
    alignSelf: 'center'
  },
  title: {
    marginTop: 50,
    marginBottom: 20,
    fontSize: 45,
    //fontWeight: 'bold',
    color: 'black',
    alignSelf: 'center',
    //backgroundColor: 'yellow'
  },
  subtitle: {
    marginBottom: 20,
    fontSize: 15,
    color: 'black',
    alignSelf: 'center',
    //backgroundColor: 'yellow'
  },
  imageStyle: {
    width: 250,
    height: 250,
    //backgroundColor: 'red',
    alignSelf: 'center'
  },
  button1: {
    backgroundColor: '#33DEC3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20, // 버튼과 이미지 사이의 간격을 조정
    alignSelf: 'center',
  },
  button2: {
    backgroundColor: '#87C686',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20, // 버튼과 이미지 사이의 간격을 조정
    alignSelf: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventbox: {
    flex: 1,
    //backgroundColor : 'red',
    margin: 20,
    marginTop: 4,
    borderRadius: 20,
    borderWidth: 2,
  },
});

export default DeadlineEventScreen;
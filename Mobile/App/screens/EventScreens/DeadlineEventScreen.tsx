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
          <View style={styles.imageView}>
            <Image style={styles.imageStyle} source={photopng}/>
          </View>
        </View>
        <TouchableOpacity style={styles.button1} onPress={handleButtonPress}>
          <Text style={styles.buttonText}>사진 공유하러 가기</Text>
        </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
  eventBox1: {
    width: '85%',
    height: '70%',
    marginTop: 30,
    backgroundColor: '#98FB98',
    borderRadius: 40,
    alignSelf: 'center',
    borderWidth: 3,
    borderColor: '#90EE90'
  },
  title: {
    marginTop: 30,
    fontSize: 50,
    color: 'black',
    alignSelf: 'center',
  },
  subtitle: {
    marginTop: 10,
    fontSize: 15,
    color: 'black',
    alignSelf: 'center',
  },
  imageView: {
    marginTop: 30,
    height: '60%',
    alignSelf: 'center',
    //backgroundColor: 'red'
  },
  imageStyle: {
    flex: 1,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  button1: {
    backgroundColor: '#98FB98',
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
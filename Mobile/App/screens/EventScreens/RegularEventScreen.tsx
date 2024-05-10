import React from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-swiper';

const calendarpng = require('../../assets/calendar.png');
const friendcodepng = require('../../assets/friendcode.png');

const RegularEventScreen: React.FC = ({navigation} : any) => {

  const handleButtonPress = () => {
    // 버튼이 눌렸을 때 실행할 동작을 정의합니다.
    // 예를 들어 다른 화면으로 이동하거나, 특정 함수를 호출하는 등의 동작을 수행할 수 있습니다.
    // navigation.navigate('TargetScreen'); // 다른 화면으로 이동하는 예시
  };

  return (
    <View style={{ height: '100%' }}>
      <View style={{ height: '100%', backgroundColor: 'white' }}>
        <Swiper
          loop={false}
          showsPagination={true}
          activeDotStyle={{ backgroundColor: 'blue', width: 10, height: 10 }}>
          {/* 첫 번째 슬라이드 */}
          <View style={{ flex: 1 }}>
            <View style={styles.eventBox1}>
              <Text style={styles.title}>출석체크</Text>
              <Text style={styles.subtitle}>매일 출석 도장을 찍으면 100 point 지급!</Text>
              <View style={styles.imageView}>
                <Image style={styles.imageStyle} source={calendarpng} />
              </View>
            </View>
            <TouchableOpacity style={styles.button1} onPress={() => navigation.navigate("DailyEventScreen")}>
              <Text style={styles.buttonText}>출석체크 하러가기</Text>
            </TouchableOpacity>
          </View>

          {/* 두 번째 슬라이드 */}
          <View style={{ flex: 1 }}>
            <View style={styles.eventBox2}>
              <Text style={styles.title}>친구코드</Text>
              <Text style={styles.subtitle}>친구에게 코드를 보내주면 10point 지급!</Text>
              <View style={styles.imageView}>
                <Image style={styles.imageStyle} source={friendcodepng} />
              </View>
            </View>
            <TouchableOpacity style={styles.button2} onPress={() => console.log("친구코드 디테일페이지")}>
              <Text style={styles.buttonText}>자세히 보기</Text>
            </TouchableOpacity>
          </View>
        </Swiper>
      </View>
      <View style={{ flex: 0.13, backgroundColor: 'white' }}>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  eventBox1: {
    width: '85%',
    height: '70%',
    marginTop: 30,
    backgroundColor: '#FFDECF',
    borderRadius: 40,
    alignSelf: 'center'
  },
  eventBox2: {
    width: '85%',
    height: '70%',
    marginTop: 30,
    backgroundColor: '#C1FFBF',
    borderRadius: 40,
    alignSelf: 'center'
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
    backgroundColor: '#FFDECF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20, // 버튼과 이미지 사이의 간격을 조정
    alignSelf: 'center',
  },
  button2: {
    backgroundColor: '#C1FFBF',
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

export default RegularEventScreen;

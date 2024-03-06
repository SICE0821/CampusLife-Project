import React from 'react';
import { View, Text, StyleSheet, } from 'react-native';
import Swiper from 'react-native-swiper';

const CommunityPage = () => {
  return (
    <View style = {styles.container}>
      <Swiper>
        <View>
          <Text>안녕하세요</Text>
        </View>
        <View>
          <Text>반갑습니다.</Text>
        </View>
        <View>
          <Text>반갑습니다.</Text>
        </View>
      </Swiper>
    </View>
  );
};


const styles = StyleSheet.create({
  container : {
    flex : 0.5,
    backgroundColor : 'red',
    
  }
})

export default CommunityPage;
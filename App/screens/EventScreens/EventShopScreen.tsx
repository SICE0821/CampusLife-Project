import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const foodpng = require('../../assets/food.png');
const coffeepng = require('../../assets/coffee.png');
const penpng = require('../../assets/pen.png');

const EventShopScreen : React.FC = () => {
  return (
    <View style={styles.itemlist}>

      <View style={styles.item}>
        <View style={styles.imageArea}>
          <Image style={styles.imageStyle} source={foodpng}/>
        </View>
        <Text style={styles.itemTitle}> 식권 교환권</Text>
        <Text style={styles.itemPoint}>  500P</Text>
      </View>
      
      <View style={styles.item}>
        <View style={styles.imageArea}>
          <Image style={styles.imageStyle} source={coffeepng}/>
        </View>
        <Text style={styles.itemTitle}> 커피 교환권</Text>
        <Text style={styles.itemPoint}>  200P</Text>
      </View>

      <View style={styles.item}>
        <View style={styles.imageArea}>
          <Image style={styles.imageStyle} source={penpng}/>
        </View>
        <Text style={styles.itemTitle}> 필기구</Text>
        <Text style={styles.itemPoint}>  100P</Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  itemlist :{
    //backgroundColor : 'red',
    alignSelf: 'center',
    width : 380,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap', // 추가된 View가 화면을 넘어갈 때 자동으로 다음 행으로 이동하도록 설정
  },
  item : {
    //backgroundColor : '#33DEC3',
    width : 170,
    height : 240,
    margin : 10,
    marginBottom: 0,
    //borderWidth : 2,
    borderRadius : 20
  },
  imageArea : {
    backgroundColor : '#FFDECF',
    borderRadius : 20
  },
  imageStyle :{
    //backgroundColor: 'red',
    alignSelf: 'center',
    width : 150,
    height : 150,
    margin : 10
  },
  itemTitle : {
    fontSize: 26,
    fontWeight : 'bold'
  },
  itemPoint : {
    fontSize: 18,
    fontWeight : 'bold'
  }
});

export default EventShopScreen;

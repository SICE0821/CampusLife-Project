import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ModalBox from 'react-native-modalbox';
import IconA from 'react-native-vector-icons/MaterialIcons';
import IconG from 'react-native-vector-icons/MaterialCommunityIcons';
import IconD from 'react-native-vector-icons/FontAwesome6';
const restaurantpng = require('../../assets/restaurant1.png');
const penpng = require('../../assets/pen1.png');
const coffeepng = require('../../assets/coffee1.png');

const dataList: any[] = [
  {
    firstitemname: "식권",
    firstvalue: "2000p",
    seconditemname: "커피",
    secondvalue: "3000P"
  },
  {
    firstitemname: "식권",
    firstvalue: "2000p",
    seconditemname: "커피",
    secondvalue: "3000P"
  },
  {
    firstitemname: "식권",
    firstvalue: "2000p",
    seconditemname: "커피",
    secondvalue: "3000P"
  },
  {
    firstitemname: "식권",
    firstvalue: "2000p",
    seconditemname: "커피",
    secondvalue: "3000P"
  },
];

const renderEmptyItem = () => {
  return (
    <View style={{ height: 85 }}>
    </View>
  )
}


const EventShopScreen: React.FC = () => {
  const navigation = useNavigation();
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달의 열기/닫기 상태를 useState로 관리

  const closeModal = () => {
    setIsModalOpen(false); // 모달을 닫기 위해 상태를 false로 설정
  };

  const selectItem = () => {
    //navigation.setOptions({ tabBarVisible:false });
    setIsModalOpen(true);
  };


  const renderItem = ({ item }: any) => (
    <View style={styles.itemrowcontainer}>
      <TouchableOpacity style={styles.itemonebox} onPress={selectItem}>
        <View style={styles.square}>
          <Image style = {{width : 130, height : 130}} source = {restaurantpng}/>
        </View>
        <View style={styles.fontbox}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: "black", marginLeft: 10 }}>{item.firstitemname}</Text>
          <Text style={{ color: 'black', marginLeft: 12 }}>{item.firstvalue}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.itemonebox}>
        <View style={styles.square}>
          <Image style = {{width : 130, height : 130}} source = {coffeepng}/>
        </View>
        <View style={styles.fontbox}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: "black", marginLeft: 10 }}>{item.seconditemname}</Text>
          <Text style={{ color: 'black', marginLeft: 12 }}>{item.secondvalue}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.pointcontainer}>
        <Text style={{ color: 'red', marginLeft: 10, }}> <IconA name="payments" size={37} /></Text>
        <Text style={{ fontSize: 20, marginLeft: 10, color: 'black' }}>잔여 포인트 : 10000P</Text>
      </View>
      <FlatList
        data={dataList}
        renderItem={renderItem}
        ListFooterComponent={renderEmptyItem} />

      <ModalBox
        isOpen={isModalOpen} // 모달의 열기/닫기 상태를 prop으로 전달
        style={styles.modal}
        position="bottom"
        swipeToClose={false}
        onClosed={closeModal} // 모달이 닫힐 때 호출되는 콜백 함수
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.headertext}>구입상품 : </Text>
            <Text style={styles.headertext}>현금 교환</Text>
            <View style={styles.itembox2}>
              <Text style={{ color: 'black' }}><IconG name="cash" size={45} /></Text>
            </View>
          </View>
          <View style={styles.text2}>
            <View style={styles.iconbox}>
              <Text style={{ color: '#9A9EFF', marginTop: 5, marginLeft: 30, }}> <IconA name="payments" size={33} /></Text>
            </View>
            <View style={styles.textbox}>
              <Text style={{ fontSize: 18, color: 'black' }}>현재 잔액 :</Text>
              <Text style={{ fontSize: 18, color: 'black' }}>10000P</Text>
            </View>
          </View>
          <View style={styles.text2}>
            <View style={styles.iconbox}>
              <View style={styles.icon2}>
                <Text style={{ color: 'black' }}><IconG name="cash" size={40} /></Text>
              </View>
            </View>
            <View style={styles.textbox}>
              <Text style={{ fontSize: 18, color: 'black', }}>상품 금액 :</Text>
              <Text style={{ fontSize: 18, color: 'black' }}>2000P</Text>
            </View>
          </View>
          <View style={styles.text2}>
            <View style={styles.iconbox}>
              <Text style={{color: 'red',marginTop: 5, marginLeft: 30, }}> <IconA name="payments" size={33} /></Text>
            </View>
            <View style={styles.textbox}>
              <Text style={{ fontSize: 18, color: 'black' }}>현재 잔액 :</Text>
              <View style={styles.money}>
                <Text style={{ fontSize: 18, color: 'black' }}>10000 - 2000 = 8000P</Text>
              </View>
            </View>
          </View>
          <View style={styles.selectButton}>
            <View style={styles.ButtonBox}>
              <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 23, marginTop: 5 }}>구입하기</Text>
            </View>
          </View>
        </View>
      </ModalBox>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  pointcontainer: {
    height: 50,
    //backgroundColor : 'blue',
    flexDirection: 'row',
    alignItems: 'center',
    //marginBottom: 20,
  },
  itemrowcontainer: {
    height: 245,
    //backgroundColor : 'green',
    //marginTop : 20,
    //marginBottom : 2,
    flexDirection: 'row'
  },
  itemonebox: {
    flex: 0.5,
    //backgroundColor : 'red',
    margin: 10,
    marginTop: -5,
  },
  square: {
    flex: 1,
    borderRadius: 20,
    margin: 10,
    backgroundColor: '#FFDECF',
    justifyContent: 'center',
    alignItems: 'center',

  },
  fontbox: {
    flex: 0.25,
    //backgroundColor : 'blue',
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 350,
  },
  modalContent: {
    flex: 1,
    //backgroundColor: 'red',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flex: 0.2,
    //backgroundColor: 'blue',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  headertext: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    marginTop : 15,
  },
  itembox2: {
    height: 45,
    width: 45,
    backgroundColor: '#FFDECF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginTop : 15,
  },
  text2: {
    flex: 0.15,
    //backgroundColor: 'red',
    flexDirection: 'row',
    //marginBottom: 10,
  },
  text3: {
    flex: 0.25,
    //backgroundColor : 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  money: {
    flex: 0.7,
    //backgroundColor : 'yellow',
    justifyContent: 'center',
  },
  icon2: {
    height: 40,
    width: 40,
    backgroundColor: '#FFDECF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 30,
  },
  selectButton: {
    flex: 0.25,
    //backgroundColor : 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ButtonBox: {
    width: 270,
    height: 45,
    margin: 20,
    borderRadius: 10,
    backgroundColor: '#9A9EFF',
    justifyContent: 'center',
    //alignContent : 'center',
    flexDirection: 'row'
  },
  iconbox: {
    flex: 0.2,
    //backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textbox: {
    flex: 0.8,
    //backgroundColor: 'green',
    alignItems: 'center',
    flexDirection: 'row',
  }

});

export default EventShopScreen;

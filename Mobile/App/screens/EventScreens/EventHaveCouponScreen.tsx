import React, {useState,} from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IconD from 'react-native-vector-icons/FontAwesome6';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ModalBox from 'react-native-modalbox';
import Barcode  from '@kichiyaki/react-native-barcode-generator';

const datalist : any[] = [
  {
    itemname : "식권",
    isused : "미사용",
    ticketusagedate : "2024-01-26 ~ 2024-02-02" 
  },
  {
    itemname : "식권",
    isused : "미사용",
    ticketusagedate : "2024-01-26 ~ 2024-02-02" 
  },
  {
    itemname : "식권",
    isused : "미사용",
    ticketusagedate : "2024-01-26 ~ 2024-02-02" 
  },
]

const EventHaveCouponScreen : React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openmodal = () => {
    setIsModalOpen(true);
  }
  const closemodal = () => {
    setIsModalOpen(false);
  }

  //랜더링 할 아이템들
  const renderItem = ({item} : any) => (
    <TouchableOpacity 
      style = {styles.itemcontainer}
      onPress={openmodal}>
      <View style = {styles.itempicturecontainer}>
        <View style = {styles.itempicture}>
          <Text style={{ color: 'black' }}><IconD name="ticket" size={65} /></Text>
        </View>
      </View>
      <View style = {styles.iteminfobox}>
        <View style = {styles.toptextbox}>
          <View style = {styles.itemnamebox}>
            <Text style = {styles.itemnamefont}>{item.itemname}</Text>
          </View>
          <View style = {styles.itemisusedbox}>
            <Text style = {styles.itemisusedfont}>{item.isused}</Text>
          </View>
        </View>
        <View style = {styles.bottomtextbox}>
          <Text style = {styles.ticketusagedatefont}>{item.ticketusagedate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  //전체 뷰
  return (
    <View style={styles.container}>
      <View style = {styles.toptitlebox}>
        <Text style = {styles.toptitletext}>보유 쿠폰</Text>
      </View>
      <View style = {styles.dividingline}>
        <FlatList 
         data = {datalist}
         renderItem={renderItem}
         />
      </View>
      <ModalBox
        isOpen = {isModalOpen}
        style = {modalstyles.modalcontainer}
        position='bottom'
        swipeToClose = {false}
        onClosed={closemodal}>
          <View style = {modalstyles.modalbox}>
            <View style = {modalstyles.itempicturebox}>
              <View style = {modalstyles.itempicture}>
                <Text style={{ color: 'black' }}><IconD name="ticket" size={120} /></Text>
              </View>
            </View>
            <View style = {modalstyles.itemnamebox}>
                <Text style = {modalstyles.itemnamepont}>식권</Text>
            </View>
            <View style = {modalstyles.itemticketusagedatebox}>
                <Text style = {modalstyles.itemticketusagedatefont}>
                  2024-01-26 ~ 2024-02-02
                </Text>
            </View>
            <View style = {modalstyles.barcordbox}>
              <Barcode
                value='02342341323213232323'
                text = "0234234132321323232"
              />
            </View>
            <View style = {modalstyles.comentbox}>
              
                <Text style = {modalstyles.comentfont}>쿠폰 기한이 일주일이므로 일주일 내로 사용하셔야 합니다.</Text>
            </View>
          </View>
      </ModalBox>
    </View>
  );
};

const styles = StyleSheet.create( {
  container : {
    flex : 1,
    backgroundColor : 'white',
  },
  toptitlebox : {
    flex : 0.06,
    //backgroundColor : "red",
    justifyContent : 'center',
    alignItems : 'center',
  },
  toptitletext : {
    fontSize : 24,
    color : 'black',
  },
  dividingline : {
    flex : 0.93,
    borderWidth : 1,
    borderTopLeftRadius : 6,
    borderTopRightRadius : 6,
    //backgroundColor : 'blue',
  },
  itemcontainer : {
    height : 100,
    //backgroundColor : 'red',
    flexDirection : 'row',
    marginTop : 20,
  },
  itempicturecontainer : {
    flex : 0.25,
    //backgroundColor : 'blue'
  },
  itempicture : {
    width : 100,
    height : 100,
    backgroundColor : '#FFDECF',
    borderRadius : 8,
    margin : 6,
    marginLeft : 10,
    justifyContent : 'center',
    alignItems : 'center',
  },
  iteminfobox : {
    flex : 0.75,
    //backgroundColor : 'yellow',
  },
  toptextbox : {
    flex : 0.5,
    //backgroundColor : 'blue',
    flexDirection : 'row',
  },
  bottomtextbox : {
    flex : 0.5,
    //backgroundColor : 'green',
    justifyContent : 'center'
  },
  itemnamebox : {
    flex : 0.68,
    //backgroundColor : 'yellow',
    justifyContent : 'center',
  },
  itemisusedbox : {
    flex : 0.32,
    //backgroundColor : 'red',
    justifyContent :'center',
    alignItems : 'center'
  },
  itemnamefont : {
    fontSize : 18,
    color : 'black',
    marginLeft : 10,
    marginTop : 7,
  },
  itemisusedfont : {
    fontSize : 18,
    color : 'black',
    marginTop : 7,
  },
  ticketusagedatefont : {
    fontSize : 18,
    color : 'black',
    marginLeft : 10,
    marginBottom : 7,
  },
})

const modalstyles = StyleSheet.create({
  modalcontainer : {
    height : 650,
    borderTopRightRadius : 10,
    borderTopLeftRadius : 10,
  },
  modalbox : {
    flex : 1,
    //backgroundColor : 'red',
    borderTopRightRadius : 10,
    borderTopLeftRadius : 10,
  },
  itempicturebox : {
    flex : 0.35,
    //backgroundColor : 'yellow',
    borderTopRightRadius : 10,
    borderTopLeftRadius : 10,
    justifyContent : 'center',
    alignItems : 'center',
  },
  itempicture : {
    height : 165,
    width : 165,
    backgroundColor : '#FFDECF',
    borderRadius : 20,
    justifyContent : 'center',
    alignItems : 'center',
    marginTop : 40,
  },
  itemnamebox : {
    flex : 0.1,
    //backgroundColor : 'red',
    justifyContent : 'center',
    alignItems : 'center',
  },
  itemnamepont : {
    fontSize : 25,
    color : 'black',
  },
  itemticketusagedatebox : {
    flex : 0.05,
    //backgroundColor : 'yellow',
    justifyContent : 'center',
    alignItems : 'center',
  },
  itemticketusagedatefont : {
    fontSize : 20,
    color : 'black',
  },
  barcordbox : {
    flex : 0.25,
    //backgroundColor : 'green',
    justifyContent : 'center',
    alignItems : 'center'
  },
  comentbox : {
    flex : 0.25,
    //backgroundColor : 'yellow',
    justifyContent : 'center',
    alignItems : 'center'
  },
  comentfont : {
    margin : 20,
    fontSize : 20,
    color : 'black',
    fontWeight : 'bold',
    textAlign: 'center',
    marginBottom : 70,
  }
})
export default EventHaveCouponScreen;
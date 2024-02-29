/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  DimensionValue,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'react-native';
import IconA from 'react-native-vector-icons/MaterialIcons';
import IconB from 'react-native-vector-icons/AntDesign';
import IconC from 'react-native-vector-icons/FontAwesome';
import IconD from 'react-native-vector-icons/Feather';
import IconE from 'react-native-vector-icons/Ionicons';
import IconF from 'react-native-vector-icons/Fontisto';
import IconG from 'react-native-vector-icons/MaterialCommunityIcons';
import IconH from 'react-native-vector-icons/Foundation';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function App(): React.JSX.Element {
  return (
    <View style = {styles.container}>
      <ScrollView>
        <View style = {styles.cardView}>
            <View style = {styles.card}>
              <View style = {styles.cardtop}>
                <View style = {styles.profile}>
                  <View style = {styles.profilePicture}>
                  </View>
                </View>
                <View style = {styles.info}>
                  <View style ={styles.name}>
                    <Text style = {{fontSize : 22, marginTop : 17, fontWeight : 'bold', color : 'black'}}> 정유환 </Text>
                  </View>
                  <View style = {styles.department}>
                    <Text style = {{fontSize : 13, marginLeft : 4, marginTop : 3, color : 'black'}}> 컴퓨터소프트웨어과/2학년</Text>
                  </View>
                  <View style = {styles.point}>
                    <Text style = {{marginLeft : 2,marginBottom : 6, color : 'black'}}> <IconA name="payments" size ={33} /></Text>
                    <Text style = {{fontSize : 21, marginLeft : 5, marginBottom : 11, color : 'black'}}>500P</Text>
                  </View>
                </View>

              </View>
              <View style = {styles.cardbottom}>
                <View style = {styles.cardchoice}>
                  <Text style = {{color : 'black'}}><IconB name = "idcard" size = {30}/></Text>
                  <Text style = {{fontSize : 11, color : 'black'}}>정보변경</Text>
                </View>
                <View style = {styles.cardchoice}>
                  <Text style = {{color : 'black'}}><IconC name = "calendar-check-o" size = {30}/></Text>
                  <Text style = {{fontSize : 11, color : 'black'}}>학적확인</Text>
                </View>
                <View style = {styles.cardchoice}>
                  <Text style = {{color : 'black'}}><IconD name = "bell" size = {30}/></Text>
                  <Text style = {{fontSize : 11, color : 'black'}}>알림</Text>
                </View>
                <View style = {styles.cardchoice}>
                  <Text style = {{color : 'black'}}><IconE name = "information-circle-outline" size = {30}/></Text>
                  <Text style = {{fontSize : 11, color : 'black'}}>학교정보</Text>
                </View>
                <View style = {styles.cardchoice}>
                  <Text style = {{color : 'black'}}><IconF name = "prescription" size = {30}/></Text>
                  <Text style = {{fontSize : 11, color : 'black'}}>스터디룸</Text>
                </View>
              </View>
            </View>
        </View>
        <View style = {styles.noticecontainer}>
          <View style = {styles.noticeheader}>
            <Text style = {styles.noticeheadertext}>학교 공지사항</Text>
            <Text style = {{marginTop : 10, marginLeft : 5, color : "#FFC700"}}><IconG name = "file-document-multiple" size = {23}/></Text>
            <Text style = {{marginLeft : 180, marginTop : 17}}>더보기</Text>
            <Text style = {{marginTop : 17}}><IconB name = {"caretright"}/></Text>
          </View>
          <View style = {styles.noticetextcontainer}>
            <View style = {styles.textborder}>
              <View style = {styles.onebox}>
                <View style = {styles.oneboxtext}>  
                  <Text style = {styles.M}>예비군 훈련 안내</Text>
                  <Text style = {{marginLeft : 8, color : 'red'}}><IconH name = "burst-new" size = {30}/></Text>
                </View>
                <View style = {styles.oneboxeye}>
                  <Text style = {{color : '#F29F05'}}> <IconB name = "eyeo" size = {26}/></Text>
                  <Text style = {{marginLeft :2, color : 'black'}}>30</Text>
                </View>
              </View>
              <View style = {styles.onebox}>
                <View style = {styles.oneboxtext}>  
                  <Text style = {styles.M}>학교 축제 안내</Text>
                </View>
                <View style = {styles.oneboxeye}>
                  <Text style = {{color : '#F29F05'}}> <IconB name = "eyeo" size = {26}/></Text>
                  <Text style = {{marginLeft :2, color : 'black'}}>30</Text>
                </View>
              </View>
              <View style = {styles.onebox}>
                <View style = {styles.oneboxtext}>  
                  <Text style = {styles.M}>총학생회장 선거 안내</Text>
                </View>
                <View style = {styles.oneboxeye}>
                  <Text style = {{color : '#F29F05'}}> <IconB name = "eyeo" size = {26}/></Text>
                  <Text style = {{marginLeft :2, color : 'black'}}>30</Text>
                </View>
              </View>
              <View style = {styles.onebox}>
                <View style = {styles.oneboxtext}>  
                  <Text style = {styles.M}>학교 식당 폐업 안내</Text>
                </View>
                <View style = {styles.oneboxeye}>
                  <Text style = {{color : '#F29F05'}}> <IconB name = "eyeo" size = {26}/></Text>
                  <Text style = {{marginLeft :2, color : 'black'}}>30</Text>
                </View>
              </View>
              <View style = {styles.onebox}>
                <View style = {styles.oneboxtext}>  
                  <Text style = {styles.M}>졸업식 연기 안내</Text>
                </View>
                <View style = {styles.oneboxeye}>
                  <Text style = {{color : '#F29F05'}}> <IconB name = "eyeo" size = {26}/></Text>
                  <Text style = {{marginLeft :2, color : 'black'}}>30</Text>
                </View>
              </View>


            </View>
          </View>
        </View>
        <View style = {styles.noticecontainer}>
          <View style = {styles.noticeheader}>
            <Text style = {styles.noticeheadertext}>학사 공지사항</Text>
            <Text style = {{marginTop : 10, marginLeft : 5, color : "#FFC700"}}><IconG name = "file-document-multiple" size = {23}/></Text>
            <Text style = {{marginLeft : 180, marginTop : 17}}>더보기</Text>
            <Text style = {{marginTop : 17}}><IconB name = {"caretright"}/></Text>
          </View>
          <View style = {styles.noticetextcontainer}>
            <View style = {styles.textborder}>
              <View style = {styles.onebox}>
                <View style = {styles.oneboxtext}>  
                  <Text style = {styles.M}>예비군 훈련 안내</Text>
                  <Text style = {{marginLeft : 8, color : 'red'}}><IconH name = "burst-new" size = {30}/></Text>
                </View>
                <View style = {styles.oneboxeye}>
                  <Text style = {{color : '#F29F05'}}> <IconB name = "eyeo" size = {26}/></Text>
                  <Text style = {{marginLeft :2, color : 'black'}}>30</Text>
                </View>
              </View>
              <View style = {styles.onebox}>
                <View style = {styles.oneboxtext}>  
                  <Text style = {styles.M}>학교 축제 안내</Text>
                </View>
                <View style = {styles.oneboxeye}>
                  <Text style = {{color : '#F29F05'}}> <IconB name = "eyeo" size = {26}/></Text>
                  <Text style = {{marginLeft :2, color : 'black'}}>30</Text>
                </View>
              </View>
              <View style = {styles.onebox}>
                <View style = {styles.oneboxtext}>  
                  <Text style = {styles.M}>총학생회장 선거 안내</Text>
                </View>
                <View style = {styles.oneboxeye}>
                  <Text style = {{color : '#F29F05'}}> <IconB name = "eyeo" size = {26}/></Text>
                  <Text style = {{marginLeft :2, color : 'black'}}>30</Text>
                </View>
              </View>
              <View style = {styles.onebox}>
                <View style = {styles.oneboxtext}>  
                  <Text style = {styles.M}>학교 식당 폐업 안내</Text>
                </View>
                <View style = {styles.oneboxeye}>
                  <Text style = {{color : '#F29F05'}}> <IconB name = "eyeo" size = {26}/></Text>
                  <Text style = {{marginLeft :2, color : 'black'}}>30</Text>
                </View>
              </View>
              <View style = {styles.onebox}>
                <View style = {styles.oneboxtext}>  
                  <Text style = {styles.M}>졸업식 연기 안내</Text>
                </View>
                <View style = {styles.oneboxeye}>
                  <Text style = {{color : '#F29F05'}}> <IconB name = "eyeo" size = {26}/></Text>
                  <Text style = {{marginLeft :2, color : 'black'}}>30</Text>
                </View>
              </View>
            </View>
          </View>
        </View>    
        <View style = {styles.noticecontainer}>
          <View style = {styles.noticeheader}>
            <Text style = {styles.noticeheadertext}>인기글</Text>
            <Text style = {{marginTop : 10, marginLeft : 5, color : "red"}}><IconF name = "fire" size = {23}/></Text>
            <Text style = {{marginLeft : 240,marginTop : 17}}>더보기</Text>
            <Text style = {{marginTop : 17}}><IconB name = {"caretright"}/></Text>
          </View>
          <View style = {styles.noticetextcontainer}>
            <View style = {styles.textborder}>
              <View style = {styles.onebox}>
                <View style = {styles.fireoneboxtext}>  
                  <Text style = {styles.M}>예비군 훈련 안내</Text>
                  <Text style = {{marginLeft : 8, color : 'red'}}><IconH name = "burst-new" size = {30}/></Text>
                </View>
                <View style = {styles.fireoneboxeye}>
                  <Text style = {{color : '#F29F05'}}> <IconB name = "eyeo" size = {26}/></Text>
                  <Text style = {{marginLeft :2, color : 'black'}}>30 /</Text>
                  <Text style = {{color : '#F29F05'}}> <IconB name = "like1" size = {20}/></Text>
                  <Text style = {{marginLeft :2, color : 'black'}}>30 </Text>
                </View>
              </View>
              <View style = {styles.onebox}>
                <View style = {styles.fireoneboxtext}>  
                  <Text style = {styles.M}>학교 축제 안내</Text>
                </View>
                <View style = {styles.fireoneboxeye}>
                  <Text style = {{color : '#F29F05'}}> <IconB name = "eyeo" size = {26}/></Text>
                  <Text style = {{marginLeft :2, color : 'black'}}>30 /</Text>
                  <Text style = {{color : '#F29F05'}}> <IconB name = "like1" size = {20}/></Text>
                  <Text style = {{marginLeft :2, color : 'black'}}>30 </Text>
                </View>
              </View>
              <View style = {styles.onebox}>
                <View style = {styles.fireoneboxtext}>  
                  <Text style = {styles.M}>총학생회장 선거 안내</Text>
                </View>
                <View style = {styles.fireoneboxeye}>
                  <Text style = {{color : '#F29F05'}}> <IconB name = "eyeo" size = {26}/></Text>
                  <Text style = {{marginLeft :2, color : 'black'}}>30 /</Text>
                  <Text style = {{color : '#F29F05'}}> <IconB name = "like1" size = {20}/></Text>
                  <Text style = {{marginLeft :2, color : 'black'}}>30 </Text>
                </View>
              </View>
              <View style = {styles.onebox}>
                <View style = {styles.fireoneboxtext}>  
                  <Text style = {styles.M}>학교 식당 폐업 안내</Text>
                </View>
                <View style = {styles.oneboxeye}>
                  <Text style = {{color : '#F29F05'}}> <IconB name = "eyeo" size = {26}/></Text>
                  <Text style = {{marginLeft :2, color : 'black'}}>30 /</Text>
                  <Text style = {{color : '#F29F05'}}> <IconB name = "like1" size = {20}/></Text>
                  <Text style = {{marginLeft :2, color : 'black'}}>30 </Text>
                </View>
              </View>
              <View style = {styles.onebox}>
                <View style = {styles.fireoneboxtext}>  
                  <Text style = {styles.M}>졸업식 연기 안내</Text>
                </View>
                <View style = {styles.oneboxeye}>
                  <Text style = {{color : '#F29F05'}}> <IconB name = "eyeo" size = {26}/></Text>
                  <Text style = {{marginLeft :2, color : 'black'}}>30 /</Text>
                  <Text style = {{color : '#F29F05'}}> <IconB name = "like1" size = {20}/></Text>
                  <Text style = {{marginLeft :2, color : 'black'}}>30 </Text>
                </View>
              </View>
            </View>
          </View>
        </View>    

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex : 1,
    backgroundColor : 'white',
  },

  cardView : {
   flex : 0.27, 
   //backgroundColor : '#EDA332',
  },

  card : {
    flex : 1,
    marginTop : 20,
    marginBottom : 20,
    marginLeft : 30,
    marginRight : 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
  },

  cardtop : {
    flex : 0.6,
    flexDirection : "row",
    backgroundColor : '#FF9C63',
    borderTopLeftRadius : 20,
    borderTopRightRadius : 20,
    borderBottomWidth: 1,
    borderColor : 'black',
  },

  cardbottom : {
    flex : 0.4,
    flexDirection : 'row',
    backgroundColor : '#FFDECF',
    borderBottomLeftRadius : 20,
    borderBottomRightRadius : 20,
    
  },
  profile : {
    flex : 0.35,
    backgroundColor : '#FF9C63',
    borderTopLeftRadius : 20,
    justifyContent : 'center',
    alignItems : 'center',

  },

  profilePicture : {
    width : 80,
    height : 80,
    backgroundColor :'white',
    borderRadius : 45,
  },

  info : {
    flex : 0.65,
    borderTopRightRadius : 20,
  },

  name : {
    flex : 0.4,
    justifyContent : 'center',
  },

  department : {
    flex : 0.2,
    justifyContent : 'center',
  },

  point : {
    flexDirection : 'row',
    flex : 0.4,
    alignItems: 'center'
  },
  
  cardchoice : {
    margin : 5, 
    flex : 0.2, borderBottomLeftRadius : 10, 
    justifyContent : 'center', 
    alignItems : 'center'
  },

  
  noticecontainer : {
    height : windowHeight -550,
   //backgroundColor : 'green',
  },

  noticeheader : {
    flex : 0.15,
    flexDirection : 'row',
    //backgroundColor : 'yellow',
    alignItems : 'center',
  },
  noticeheadertext : {
    fontSize : 20,
    marginTop : 10,
    marginLeft : 15,
    color : 'black',
  },

  noticetextcontainer : {
    //justifyContent : 'center',
    //alignItems : 'center',
    flex : 0.85,
    
    //backgroundColor : "blue"
  },

  textborder : {
    flex : 1,
    marginTop : 1,
    marginBottom : 10,
    marginLeft : 10,
    marginRight : 10,
    //backgroundColor : 'green',
    borderRadius : 15,
    borderWidth : 2,
  },

  onebox : {
    //backgroundColor : 'yellow',
    flex : 0.2,
    flexDirection : 'row',
    alignItems : 'center',
    
  },

  oneboxtext : {
    flex : 0.86,
    //backgroundColor : 'blue',
    flexDirection : 'row',
    alignItems : 'center',
  },

  oneboxeye : {
    flex : 0.14,
    //backgroundColor : 'green',
    flexDirection : 'row',
    alignItems : 'center',
  },

  fireoneboxtext :{
    flex : 0.73,
    //backgroundColor : 'blue',
    flexDirection : 'row',
    alignItems : 'center',
  },

  fireoneboxeye : {
    flex : 0.27,
    //backgroundColor : 'green',
    flexDirection : 'row',
    alignItems : 'center',
  },

  M : {
    marginLeft : 10,
    fontSize : 17,
    color : 'black',
  },

});

export default App;
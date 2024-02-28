/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextBase,
  useColorScheme,
  View,
} from 'react-native';
import { StatusBar } from 'react-native';
import IconA from 'react-native-vector-icons/MaterialIcons';
import IconB from 'react-native-vector-icons/AntDesign';
import IconC from 'react-native-vector-icons/FontAwesome';
import IconD from 'react-native-vector-icons/Feather';
import IconE from 'react-native-vector-icons/Ionicons';
import IconF from 'react-native-vector-icons/Fontisto';

function App(): React.JSX.Element {
  return (
    <View style = {styles.container}>
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
   //backgroundColor : 'red',
   
  },

  card : {
    flex : 1,
    backgroundColor : 'green',
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
    width : 95,
    height : 95,
    backgroundColor :'white',
    borderRadius : 50,
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
});

export default App;
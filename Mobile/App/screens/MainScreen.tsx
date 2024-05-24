import React, {useState, useEffect} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Dimensions,
  Image,
} from 'react-native';
import Swiper from 'react-native-swiper';
import {UserData} from '../types/type'
import ImageCropPicker from 'react-native-image-crop-picker';

import IconA from 'react-native-vector-icons/MaterialIcons';
import IconB from 'react-native-vector-icons/AntDesign';
import IconC from 'react-native-vector-icons/FontAwesome';
import IconD from 'react-native-vector-icons/Feather';
import IconE from 'react-native-vector-icons/Ionicons';
import IconF from 'react-native-vector-icons/Fontisto';
import IconG from 'react-native-vector-icons/MaterialCommunityIcons';
import IconH from 'react-native-vector-icons/Foundation';
import IconI from 'react-native-vector-icons/FontAwesome5';

const attendancepng = require('../assets/handup.jpg');
const friendsinvitepng = require('../assets/friend3.jpg');
const volunteerpng = require('../assets/animation.gif');


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

type mainpagepostdata = {
  post_id: number,
  title: string,
  view: number,
}

type mainpagehptdata = {
  post_id: number,
  title: string,
  view: number,
  like: number,
}

const MainPage = ({navigation ,route} : any) => {
  const { userdata } = route.params;
  const [schoolpostdata, setschollpostdata] = useState<mainpagepostdata[]>([]);
  const [departmentpostdata, setdepartmentpostdata] = useState<mainpagepostdata[]>([]);
  const [hotpostdata, sethotpostdata] = useState<mainpagehptdata[]>([]);
  const [userData, setUserData] = useState<UserData>(userdata);
  const [Userdepartment, setUserDepartment] = useState();
  const [imagepath, setimagepath] = useState<string>();
  
  const getPhotos = async () => {
    ImageCropPicker.openPicker({
      multiple: true,
      mediaType: 'photo',
      includeBase64: true,
      includeExif: true,
      }).then(res => {
        const imagePaths = res.map(image => image.path);
        console.log(imagePaths);
        setimagepath(imagePaths[0]);
    });
  };
  
  const get_user_department = async () => {
    try {
      const response = await fetch('http://172.16.117.211:3000/get_department_name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          department_name: userData.department_pk,
        })
      })
      const userdepartment = await response.json();
      const userDepartment = userdepartment.userdepartment; //키값을 치면 값을 json에서 추출할 수 있다.
      setUserDepartment(userDepartment);
    } catch (error) {
      console.error('유저 학과 이름 가져오기 실패:', error);
    }
  }

  const fetchschoolpostData = async () => {
      try {
        const response = await fetch('http://172.16.117.211:3000/MainPageSchoolPost');
        if (!response.ok) {
          throw new Error('서버 응답 실패');
        }
        const data = await response.json();
        setschollpostdata(data);
       //console.log("데이터 받음:", data);
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      }
    };

    const fetchdepartmentpostData = async () => {
      try {
        const response = await fetch('http://172.16.117.211:3000/MainPagedepartmentPost');
        if (!response.ok) {
          throw new Error('서버 응답 실패');
        }
        const data = await response.json();
        setdepartmentpostdata(data);
        //console.log("데이터 받음:", data);
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      }
    };

    const fetchhotpostData = async () => {
      try {
        const response = await fetch('http://172.16.117.211:3000/MainPagehotPost');
        if (!response.ok) {
          throw new Error('서버 응답 실패');
        }
        const data = await response.json();
        sethotpostdata(data);
        //console.log("데이터 받음:", data);
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      }
    };
    const settingUserData = () => {
      setUserData(userdata);
    }

    const StudentInfo = async () => {
      console.log(userData);
      navigation.navigate('StudentInfoNavigator', {userData, Userdepartment});
    }

    const AcademicInfo = async () =>{
      navigation.navigate('AcademicInfoNavigator', {userData});
    }
    useFocusEffect(
      React.useCallback(() => {
        fetchschoolpostData();
        fetchdepartmentpostData();
        fetchhotpostData();
        settingUserData();
        get_user_department();
        if (navigation.getState().routes[navigation.getState().index].params?.updatedUserData) {
          const updatedUserData = navigation.getState().routes[navigation.getState().index].params.updatedUserData;
          setUserData(updatedUserData);
      }
      }, [navigation])
    )
  return (
    <View style = {styles.container}>
      <ScrollView>
        <View style = {styles.cardView}>
            <View style = {styles.card}>
              <View style = {styles.cardtop}>
                <View style = {styles.profile}>
                  <View style = {styles.profilePicture}>
                  {userData.profile_photo ? (
                    <Image
                      source={{ uri: userData.profile_photo }}
                      style={{ width: 85, height: 85, borderRadius: 50 }}
                    />
                  ) : (
                    <IconI name="user" size={40} color="black" style={{width: 85, height: 85, borderRadius: 50, marginLeft : 50, marginTop : 40,}}/>
                  )}
                  </View>
                </View>
                <View style = {styles.info}>
                  <View style ={styles.name}>
                    <Text style = {{fontSize : 25, marginTop : 17, fontWeight : 'bold', color : 'black'}}> {userData.name} </Text>
                  </View>
                  <View style = {styles.department}>
                    <Text style = {{fontSize : 15, marginLeft : 4, marginTop : 3, color : 'black'}}> {Userdepartment}/{userData.grade}학년</Text>
                  </View>
                  <View style = {styles.point}>
                    <Text style = {{marginLeft : 2,marginBottom : 6, color : 'black'}}> <IconA name="payments" size ={36} /></Text>
                    <Text style = {{fontSize : 24, marginLeft : 5, marginBottom : 11, color : 'black'}}>{userData.point}</Text>
                  </View>
                </View>

              </View>
              <View style = {styles.cardbottom}>
                <TouchableOpacity style = {styles.cardchoice} onPress = {StudentInfo}>
                  <Text style = {{color : 'black'}}><IconB name = "idcard" size = {30}/></Text>
                  <Text style = {{fontSize : 15, color : 'black'}}>정보변경</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.cardchoice} onPress = {AcademicInfo}>
                  <Text style = {{color : 'black'}}><IconC name = "calendar-check-o" size = {30}/></Text>
                  <Text style = {{fontSize : 15, color : 'black', marginTop : 5}}>학적확인</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.cardchoice} onPress = {() => navigation.navigate("AlarmDialogScreen")}>
                  <Text style = {{color : 'black'}}><IconD name = "bell" size = {30}/></Text>
                  <Text style = {{fontSize : 15, color : 'black', marginTop : 5}}>알림</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.cardchoice} onPress = {() => navigation.navigate("SchoolInfoScreen")}>
                  <Text style = {{color : 'black'}}><IconE name = "information-circle-outline" size = {30}/></Text>
                  <Text style = {{fontSize : 15, color : 'black'}}>학교정보</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.cardchoice} onPress = {() => navigation.navigate("StudyRoomScreen")}>
                  <Text style = {{color : 'black'}}><IconF name = "prescription" size = {30}/></Text>
                  <Text style = {{fontSize : 15, color : 'black', marginTop : 5}}>스터디룸</Text>
                </TouchableOpacity>
              </View>
            </View>
        </View>
        <View style = {styles.eventcontainer}>
          <View style = {styles.eventhearder}> 
            <Text style = {styles.eventheadertext}>이벤트</Text>
            <Text style = {{marginTop : 1, marginLeft : 5, color : "#FFC700"}}><IconF name = "ticket" size = {27}/></Text>
          </View>
          <Swiper loop = {true}>
            <View style = {styles.eventbox}>
              <View style = {styles.eventpicture}>
                <Image style = {{width : 430, height : 260, backgroundColor : 'red'}}
                        source={attendancepng}
                        />
                </View>
              <View style = {styles.eventtext}>
                <Text style = {{fontSize : 20, fontWeight : 'bold', margin : 8, color : 'black'}}>출석체크 이벤트!</Text>
                <Text style = {{marginLeft : 10,}}>앱을 정기적으로 출석할 시에 포인트를 제공해 드립니다!</Text>
              </View>
            </View>
            <View style = {styles.eventbox}>
              <View style = {styles.eventpicture}>
                <Image style = {{width : 430, height : 260}}
                        source = {friendsinvitepng}
                        />
                </View>
              <View style = {styles.eventtext}>
                <Text style = {{fontSize : 20, fontWeight : 'bold', margin : 8, color : 'black'}}>친구코드 이벤트!</Text>
                <Text style = {{marginLeft : 10,}}>친구에게 나의 코드를 보낼시에 포인트를 제공해 드립니다!</Text>
              </View>
            </View>
            <View style = {styles.eventbox}>
              <View style = {styles.eventpicture}>
                <Image style = {{width : 430, height : 250}}
                        source = {volunteerpng}
                        resizeMode="contain"/>
                </View>
              <View style = {styles.eventtext}>
                <Text style = {{fontSize : 20, fontWeight : 'bold', margin : 8, color : 'black'}}>봉사활동 이벤트!</Text>
                <Text style = {{marginLeft : 10,}}>봉사활동을 하고 인증해주시면 포인트를 제공해 드립니다!</Text>
              </View>
            </View>
          </Swiper>
          </View>
        <View style = {styles.noticecontainer}>
          <View style = {styles.noticeheader}>
            <Text style = {styles.noticeheadertext}>학교 공지사항</Text>
            <Text style = {{marginTop : 15, marginLeft : 5, color : "#FFC700"}}><IconG name = "file-document-multiple" size = {28}/></Text>
            <Text style = {{marginLeft : 130, marginTop : 25, fontSize : 17,}}>더보기</Text>
            <Text style = {{marginTop : 26,}}><IconB name = {"caretright"} size = {17}/></Text>
          </View>
          <View style = {styles.noticetextcontainer}>
            <View style = {styles.textborder}>
              <View style = {styles.onebox}>
                <View style = {styles.oneboxtext}>  
                  <Text style = {styles.M}>{schoolpostdata[0]?.title}</Text>
                  <Text style = {{marginLeft : 8, color : 'red'}}><IconH name = "burst-new" size = {40}/></Text>
                </View>
                <View style = {styles.oneboxeye}>
                  <Text style = {{color : '#F29F05', marginLeft : -12}}> <IconB name = "eyeo" size = {30}/></Text>
                  <Text style = {{marginLeft :2, color : 'black', fontSize : 17}}>{schoolpostdata[0]?.view}</Text>
                </View>
              </View>
              <View style = {styles.onebox}>
                <View style = {styles.oneboxtext}>  
                  <Text style = {styles.M}>{schoolpostdata[1]?.title}</Text>
                </View>
                <View style = {styles.oneboxeye}>
                  <Text style = {{color : '#F29F05', marginLeft : -12}}> <IconB name = "eyeo" size = {30}/></Text>
                  <Text style = {{marginLeft :2, color : 'black', fontSize : 17}}>{schoolpostdata[1]?.view}</Text>
                </View>
              </View>
              <View style = {styles.onebox}>
                <View style = {styles.oneboxtext}>  
                  <Text style = {styles.M}>{schoolpostdata[2]?.title}</Text>
                </View>
                <View style = {styles.oneboxeye}>
                  <Text style = {{color : '#F29F05', marginLeft : -12}}> <IconB name = "eyeo" size = {30}/></Text>
                  <Text style = {{marginLeft :2, color : 'black', fontSize : 17}}>{schoolpostdata[2]?.view}</Text>
                </View>
              </View>
              <View style = {styles.onebox}>
                <View style = {styles.oneboxtext}>  
                  <Text style = {styles.M}>{schoolpostdata[3]?.title}</Text>
                </View>
                <View style = {styles.oneboxeye}>
                  <Text style = {{color : '#F29F05', marginLeft : -12}}> <IconB name = "eyeo" size = {30}/></Text>
                  <Text style = {{marginLeft :2, color : 'black', fontSize : 17}}>{schoolpostdata[3]?.view}</Text>
                </View>
              </View>
              <View style = {styles.onebox}>
                <View style = {styles.oneboxtext}>  
                  <Text style = {styles.M}>{schoolpostdata[4]?.title}</Text>
                </View>
                <View style = {styles.oneboxeye}>
                  <Text style = {{color : '#F29F05', marginLeft : -12}}> <IconB name = "eyeo" size = {30}/></Text>
                  <Text style = {{marginLeft :2, color : 'black', fontSize : 17}}>{schoolpostdata[4]?.view}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style = {styles.noticecontainer}>
          <View style = {styles.noticeheader}>
            <Text style = {styles.noticeheadertext}>학사 공지사항</Text>
            <Text style = {{marginTop : 15, marginLeft : 5, color : "#FFC700"}}><IconG name = "file-document-multiple" size = {28}/></Text>
            <Text style = {{marginLeft : 130, marginTop : 25, fontSize : 17,}}>더보기</Text>
            <Text style = {{marginTop : 26}}><IconB name = {"caretright"} size = {17}/></Text>
          </View>
          <View style = {styles.noticetextcontainer}>
            <View style = {styles.textborder}>
              <View style = {styles.onebox}>
                <View style = {styles.oneboxtext}>  
                  <Text style = {styles.M}>{departmentpostdata[0]?.title}</Text>
                  <Text style = {{marginLeft : 8, color : 'red'}}><IconH name = "burst-new" size = {40}/></Text>
                </View>
                <View style = {styles.oneboxeye}>
                  <Text style = {{color : '#F29F05', marginLeft : -12}}> <IconB name = "eyeo" size = {30}/></Text>
                  <Text style = {{marginLeft :2, color : 'black', fontSize : 17}}>{departmentpostdata[0]?.view}</Text>
                </View>
              </View>
              <View style = {styles.onebox}>
                <View style = {styles.oneboxtext}>  
                  <Text style = {styles.M}>{departmentpostdata[1]?.title}</Text>
                </View>
                <View style = {styles.oneboxeye}>
                  <Text style = {{color : '#F29F05', marginLeft : -12}}> <IconB name = "eyeo" size = {30}/></Text>
                  <Text style = {{marginLeft :2, color : 'black', fontSize : 17}}>{departmentpostdata[1]?.view}</Text>
                </View>
              </View>
              <View style = {styles.onebox}>
                <View style = {styles.oneboxtext}>  
                  <Text style = {styles.M}>{departmentpostdata[2]?.title}</Text>
                </View>
                <View style = {styles.oneboxeye}>
                  <Text style = {{color : '#F29F05', marginLeft : -12}}> <IconB name = "eyeo" size = {30}/></Text>
                  <Text style = {{marginLeft :2, color : 'black', fontSize : 17}}>{departmentpostdata[2]?.view}</Text>
                </View>
              </View>
              <View style = {styles.onebox}>
                <View style = {styles.oneboxtext}>  
                  <Text style = {styles.M}>{departmentpostdata[3]?.title}</Text>
                </View>
                <View style = {styles.oneboxeye}>
                  <Text style = {{color : '#F29F05', marginLeft : -12}}> <IconB name = "eyeo" size = {30}/></Text>
                  <Text style = {{marginLeft :2, color : 'black', fontSize : 17}}>{departmentpostdata[3]?.view}</Text>
                </View>
              </View>
              <View style = {styles.onebox}>
                <View style = {styles.oneboxtext}>  
                  <Text style = {styles.M}>{departmentpostdata[4]?.title}</Text>
                </View>
                <View style = {styles.oneboxeye}>
                  <Text style = {{color : '#F29F05', marginLeft : -12}}> <IconB name = "eyeo" size = {30}/></Text>
                  <Text style = {{marginLeft :2, color : 'black', fontSize : 17}}>{departmentpostdata[4]?.view}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>    
        <View style = {styles.noticecontainer}>
          <View style = {styles.noticeheader}>
            <Text style = {styles.noticeheadertext}>인기글</Text>
            <Text style = {{marginTop : 15, marginLeft : 5, color : "red"}}><IconF name = "fire" size = {27}/></Text>
            <Text style = {{marginLeft : 205, marginTop : 25, fontSize : 17,}}>더보기</Text>
            <Text style = {{marginTop : 26}}><IconB name = {"caretright"} size = {17}/></Text>
          </View>
          <View style = {styles.noticetextcontainer}>
            <View style = {styles.textborder}>
              <View style = {styles.onebox}>
                <View style = {styles.fireoneboxtext}>  
                  <Text style = {styles.M}>{hotpostdata[0]?.title}</Text>
                  <Text style = {{marginLeft : 8, color : 'red'}}><IconH name = "burst-new" size = {40}/></Text>
                </View>
                <View style = {styles.fireoneboxeye}>
                  <Text style = {{color : '#F29F05', marginLeft : -13}}> <IconB name = "eyeo" size = {30}/></Text>
                  <Text style = {{marginLeft :2, color : 'black', fontSize : 17}}>{hotpostdata[0]?.view} /</Text>
                  <Text style = {{color : '#F29F05'}}> <IconB name = "like1" size = {25}/></Text>
                  <Text style = {{marginLeft :2, color : 'black', fontSize : 17}}>{hotpostdata[0]?.like} </Text>
                </View>
              </View>
              <View style = {styles.onebox}>
                <View style = {styles.fireoneboxtext}>  
                  <Text style = {styles.M}>{hotpostdata[1]?.title}</Text>
                </View>
                <View style = {styles.fireoneboxeye}>
                  <Text style = {{color : '#F29F05', marginLeft : -13}}> <IconB name = "eyeo" size = {30}/></Text>
                  <Text style = {{marginLeft :2, color : 'black', fontSize : 17}}>{hotpostdata[1]?.view} /</Text>
                  <Text style = {{color : '#F29F05'}}> <IconB name = "like1" size = {25}/></Text>
                  <Text style = {{marginLeft :2, color : 'black', fontSize : 17}}>{hotpostdata[1]?.like} </Text>
                </View>
              </View>
              <View style = {styles.onebox}>
                <View style = {styles.fireoneboxtext}>  
                  <Text style = {styles.M}>{hotpostdata[2]?.title}</Text>
                </View>
                <View style = {styles.fireoneboxeye}>
                  <Text style = {{color : '#F29F05', marginLeft : -13}}> <IconB name = "eyeo" size = {30}/></Text>
                  <Text style = {{marginLeft :2, color : 'black', fontSize : 17}}>{hotpostdata[2]?.view} /</Text>
                  <Text style = {{color : '#F29F05'}}> <IconB name = "like1" size = {25}/></Text>
                  <Text style = {{marginLeft :2, color : 'black', fontSize : 17}}>{hotpostdata[2]?.like} </Text>
                </View>
              </View>
              <View style = {styles.onebox}>
                <View style = {styles.fireoneboxtext}>  
                  <Text style = {styles.M}>{hotpostdata[3]?.title}</Text>
                </View>
                <View style = {styles.oneboxeye}>
                  <Text style = {{color : '#F29F05', marginLeft : -13}}> <IconB name = "eyeo" size = {30}/></Text>
                  <Text style = {{marginLeft :2, color : 'black', fontSize : 17}}>{hotpostdata[3]?.view} /</Text>
                  <Text style = {{color : '#F29F05'}}> <IconB name = "like1" size = {25}/></Text>
                  <Text style = {{marginLeft :2, color : 'black', fontSize : 17}}>{hotpostdata[3]?.like} </Text>
                </View>
              </View>
              <View style = {styles.onebox}>
                <View style = {styles.fireoneboxtext}>  
                  <Text style = {styles.M}>{hotpostdata[4]?.title}</Text>
                </View>
                <View style = {styles.oneboxeye}>
                  <Text style = {{color : '#F29F05', marginLeft : -13}}> <IconB name = "eyeo" size = {30}/></Text>
                  <Text style = {{marginLeft :2, color : 'black'}}>{hotpostdata[4]?.view} /</Text>
                  <Text style = {{color : '#F29F05', fontSize : 17}}> <IconB name = "like1" size = {25}/></Text>
                  <Text style = {{marginLeft :2, color : 'black', fontSize : 17}}>{hotpostdata[4]?.like} </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style = {{height : 50, backgroundColor : 'white', }}></View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex : 1,
    backgroundColor : '#F9F9F9',
  },

  cardView : {
   height : 230, 
   //backgroundColor : '#EDA332',
  },

  card : {
    flex : 1,
    marginTop : 20,
    marginBottom : 20,
    marginLeft : 30,
    marginRight : 30,
    borderRadius: 20,
    //borderWidth: 2,
    borderColor: 'black',
    //backgroundColor : 'blue',
    elevation: 5,

  },

  cardtop : {
    flex : 0.6,
    flexDirection : "row",
    //backgroundColor : '#FF9C63',
    backgroundColor : '#FFFADD',
    borderTopLeftRadius : 20,
    borderTopRightRadius : 20,
    borderBottomWidth: 0.5,
    borderColor : 'F0EEEE',
  },

  cardbottom : {
    flex : 0.4,
    flexDirection : 'row',
    //backgroundColor : '#FFDECF',
    backgroundColor : 'white',
    borderBottomLeftRadius : 20,
    borderBottomRightRadius : 20,
    
  },
  profile : {
    flex : 0.35,
    //backgroundColor : '#FF9C63',
    backgroundColor : '#FFFADD',
    borderTopLeftRadius : 20,
    justifyContent : 'center',
    alignItems : 'center',

  },

  profilePicture : {
    width : 85,
    height : 85,
    backgroundColor :'white',
    borderRadius : 50,
    justifyContent : 'center',
    alignItems : 'center',
    borderWidth : 1,
    borderColor: 'lightgray',
    
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
    height : windowHeight -500,
    marginTop : -50,
    //marginBottom : 15,
    //backgroundColor : 'green',
    marginLeft : 15,
    marginRight : 15,
  },

  noticeheader : {
    flex : 0.15,
    flexDirection : 'row',
    //backgroundColor : 'yellow',
    alignItems : 'center',
  },
  noticeheadertext : {
    fontSize : 20,
    marginTop : 15,
    marginLeft : 15,
    color : 'black',
    fontWeight : 'bold'
  },

  noticetextcontainer : {
    //justifyContent : 'center',
    //alignItems : 'center',
    flex : 0.75,
    //backgroundColor : "blue"
  },

  textborder : {
    flex : 1,
    marginTop : 1,
    marginBottom : 10,
    marginLeft : 10,
    marginRight : 10,
    backgroundColor : 'white',
    borderRadius : 15,
    elevation: 5,
    //borderWidth : 2,

    
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
    marginLeft : 15,
    fontSize : 19,
    color : 'black',
  },

  eventcontainer : {
    height : 420,
    //backgroundColor : 'green',
    marginBottom : 35,
  
  },

  eventheadertext : {
    fontSize : 20,
    marginLeft : 23,
    color : 'black',
    fontWeight : 'bold'
  },

  eventbox : {
    flex  : 1,
    //backgroundColor : 'red',
    margin : 20,
    marginTop : 4,
    borderRadius : 20,
    //borderWidth : 2,
    elevation : 5,
  },

  eventpicture : {
    flex : 0.75,
    borderTopLeftRadius : 20,
    borderTopRightRadius : 20,
    //borderBottomWidth : 2,
    backgroundColor : 'white',
    justifyContent : 'center',
    alignItems : 'center',
    //elevation: 5, 
  },

  eventtext : {
    backgroundColor : 'white',
    flex : 0.25,
    borderBottomLeftRadius : 20,
    borderBottomRightRadius : 20,
    
  },

  eventhearder : {
    flex : 0.08,
    //backgroundColor : 'red',
    flexDirection : 'row',
  }

});

export default MainPage;

